// Fixed promotion.repository.ts
import db from "../../../config/database.ts";
import { GenericRepository } from "../../generic.repository.ts";
import { Promotion } from "../promotion.model.ts";
import { PromotionResponseDto, PromotionCreateDto, PromotionUpdateDto } from "../dto/promotion.dto.ts";

export class PromotionRepository extends GenericRepository<Promotion> {
  constructor() {
    super({
      tableName: "promotions",
      primaryKey: "promotion_id",
    });
  }

  async findActivePromotionForProduct(productId: number): Promise<Promotion | null> {
    const client = db.getClient();
    const now = new Date();

    const query = `
      SELECT * FROM promotions 
      WHERE product_id = $1 
      AND active = true 
      AND begin_date <= $2 
      AND end_date >= $2
      LIMIT 1
    `;

    const result = await client.queryObject<Promotion>({
      text: query,
      args: [productId, now],
    });

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createPromotion(data: PromotionCreateDto): Promise<number> {
    const client = db.getClient();

    // Convert from camelCase DTO to snake_case for DB
    const promotionData = {
      product_id: data.productId,
      percentage: data.percentage,
      begin_date: data.beginDate,
      end_date: data.endDate,
      active: data.active
    };

    const columns = Object.keys(promotionData);
    const values = Object.values(promotionData);

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const query = `
      INSERT INTO promotions (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING promotion_id
    `;

    const result = await client.queryObject<{ promotion_id: number }>({
      text: query,
      args: values,
    });

    return result.rows[0].promotion_id;
  }

  async findAllActivePromotions(): Promise<Promotion[]> {
    const client = db.getClient();
    const now = new Date();

    const query = `
      SELECT * FROM promotions 
      WHERE active = true 
      AND begin_date <= $1 
      AND end_date >= $1
    `;

    const result = await client.queryObject<Promotion>({
      text: query,
      args: [now],
    });

    return result.rows;
  }

  async findExpiredPromotions(): Promise<Promotion[]> {
    const client = db.getClient();
    const now = new Date();

    const query = `
      SELECT * FROM promotions 
      WHERE active = true 
      AND end_date < $1
    `;

    const result = await client.queryObject<Promotion>({
      text: query,
      args: [now],
    });

    return result.rows;
  }

  async deactivateExpiredPromotions(): Promise<number> {
    const client = db.getClient();
    const now = new Date();

    const query = `
      UPDATE promotions
      SET active = false
      WHERE active = true AND end_date < $1
      RETURNING promotion_id
    `;

    const result = await client.queryObject<{ promotion_id: number }>({
      text: query,
      args: [now],
    });

    return result.rows.length;
  }
}

const promotionRepository = new PromotionRepository();
export default promotionRepository;