// modules/products/bll/product.service.ts
import { Product } from "../product.model.ts";
import productRepository from "../dal/product.repository.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";

class ProductService {
    async getAllProducts(): Promise<Product[]> {
        return productRepository.findAll();
    }

    async getProductById(product_id: number): Promise<Product | null> {
        return productRepository.findById(product_id);
    }

    /**
     * Crée un nouveau produit (PK auto-incrémentée dans votre DB).
     * @param data - champs du produit (sans product_id)
     * @param user_id - l'utilisateur qui crée le produit (pour le log)
     */
    async createProduct(data: Omit<Product, "product_id">, user_id: number): Promise<void> {
        // 1) Insérer le produit
        //    Option A: si vous avez createReturningId => utilisez-le
        const newId = await productRepository.createReturningId(data);

        // 2) Relire le produit
        const productCreated = await productRepository.findById(newId);
        if (!productCreated) {
            // si pour une raison obscure il n’existe pas...
            return;
        }

        // 3) Log l'opération "CREATE"
        await logService.createLog({
            logId: 0,
            date: new Date(),
            userId: user_id,
            productId: String(newId),
            quantity: 0, // pas de mouvement de quantité
            reason: "New product created",
            action: ActionTypeEnum.CREATE,
            stockType: StockTypeEnum.WAREHOUSE, // ou SHELF, selon votre logique
            stock_warehouse_after: productCreated.stock_warehouse ?? 0,
            stock_shelf_bottom_after: productCreated.stock_shelf_bottom ?? 0,
        });
    }

    async updateProduct(product_id: number, data: Partial<Product>): Promise<void> {
        await productRepository.update(product_id, data);
    }

    async deleteProduct(product_id: number): Promise<void> {
        await productRepository.deleteById(product_id);
    }

    /**
     * Ajouter un certain `quantity` de produits au stock warehouse
     */
    async addToWarehouse(product_id: number, quantity: number, user_id: number): Promise<Product | null> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(product_id);
        if (!product) {
            throw new Error("Product not found");
        }

        const newWarehouse = (product.stock_warehouse ?? 0) + quantity;
        await productRepository.update(product_id, { stock_warehouse: newWarehouse });

        // Relire
        const updated = await productRepository.findById(product_id);

        // Log
        await logService.createLog({
            date: new Date(),
            user_id: user_id,
            product_id: product_id.toString(),
            quantity,
            reason: "Add to warehouse",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.WAREHOUSE,
            stock_warehouse_after: updated?.stock_warehouse ?? 0,
            stock_shelf_bottom_after: updated?.stock_shelf_bottom ?? 0,
        });

        return updated;
    }

    /**
     * Transférer du stock warehouse vers shelf
     */
    async transferToShelf(product_id: number, quantity: number, user_id: number) {
        // 1) Vérifier la validité
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(product_id);
        if (!product) {
            throw new Error(`Product ${product_id} not found`);
        }

        const currentWarehouse = product.stock_warehouse ?? 0;
        if (currentWarehouse < quantity) {
            throw new Error("Not enough stock in warehouse");
        }

        const currentShelf = product.stock_shelf_bottom ?? 0;

        // 2) Calcul du nouveau stock
        const newWarehouse = currentWarehouse - quantity;
        const newShelf = currentShelf + quantity;

        // 3) Mise à jour en BDD
        await productRepository.update(product_id, {
            stock_warehouse: newWarehouse,
            stock_shelf_bottom: newShelf,
        });

        // 4) Relire l'état final
        const finalProduct = await productRepository.findById(product_id);

        // 5) Créer deux logs
        const dateNow = new Date();

        // Log A : REMOVE_FROM WAREHOUSE
        await logService.createLog({
            date: dateNow,
            user_id: user_id,
            product_id: product_id.toString(),
            quantity,
            reason: "Transfer from warehouse to shelf (out of warehouse)",
            action: ActionTypeEnum.REMOVE_FROM,   // On retire du warehouse
            stockType: StockTypeEnum.WAREHOUSE,
            stock_warehouse_after: finalProduct?.stock_warehouse,     // état final
            stock_shelf_bottom_after: finalProduct?.stock_shelf_bottom,
        });

        // Log B : ADD_TO SHELF
        await logService.createLog({
            date: dateNow,
            user_id: user_id,
            product_id: product_id.toString(),
            quantity,
            reason: "Transfer from warehouse to shelf (into shelf)",
            action: ActionTypeEnum.ADD_TO,        // On ajoute au shelf
            stockType: StockTypeEnum.SHELF,
            stock_warehouse_after: finalProduct?.stock_warehouse,
            stock_shelf_bottom_after: finalProduct?.stock_shelf_bottom,
        });

        return finalProduct;
    }

}

export const productService = new ProductService();
export default productService;
