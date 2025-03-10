// modules/products/bll/product.service.ts
import { Product } from "../product.model.ts";
import productRepository from "../dal/product.repository.ts";
import promotionService from "../../promotions/bll/promotion.service.ts";
import logService from "../../logs/bll/log.service.ts";
import { ActionTypeEnum } from "../../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../../enums/stockTypeEnum.ts";
import { ProductResponseDto, ProductCreateDto, ProductUpdateDto } from "../dto/product.dto.ts";

class ProductService {
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await productRepository.findAll();
        return await Promise.all(products.map(async (product) => this.enrichProductWithPromotion(product)));
    }

    async getProductById(productId: number): Promise<ProductResponseDto | null> {
        const product = await productRepository.findById(productId);
        if (!product) return null;
        return await this.enrichProductWithPromotion(product);
    }

    async getProductByEAN(ean: string): Promise<ProductResponseDto | null> {
        const product = await productRepository.findByEAN(ean);
        if (!product) return null;
        return await this.enrichProductWithPromotion(product);
    }

    async createProduct(data: ProductCreateDto, userId: number): Promise<ProductResponseDto> {
        // Convert from camelCase DTO to snake_case for database
        const productData = {
            ean: data.ean,
            name: data.name,
            brand: data.brand,
            description: data.description,
            picture: data.picture,
            nutritional_information: data.nutritionalInformation,
            price: data.price,
            stock_warehouse: data.stockWarehouse,
            stock_shelf_bottom: data.stockShelfBottom,
            minimum_stock: data.minimumStock,
            minimum_shelf_stock: data.minimumShelfStock,
            category_id: data.categoryId
        };

        // Insert the product
        const newId = await productRepository.createReturningId(productData);

        // Retrieve the created product
        const productCreated = await productRepository.findById(newId);
        if (!productCreated) {
            throw new Error("Failed to create product");
        }

        // Log the operation "CREATE"
        await logService.createLog({
            date: new Date(),
            userId: userId,
            productId: newId,
            quantity: 0, // No stock movement
            reason: "New product created",
            action: ActionTypeEnum.CREATE,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: productCreated.stock_warehouse ?? 0,
            stockShelfBottomAfter: productCreated.stock_shelf_bottom ?? 0,
        });

        return await this.enrichProductWithPromotion(productCreated);
    }

    async updateProduct(productId: number, data: ProductUpdateDto, userId: number): Promise<ProductResponseDto> {
        const existingProduct = await productRepository.findById(productId);
        if (!existingProduct) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        // Convert from camelCase DTO to snake_case for database
        const updateData: Partial<Product> = {};

        if (data.ean !== undefined) updateData.ean = data.ean;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.brand !== undefined) updateData.brand = data.brand;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.picture !== undefined) updateData.picture = data.picture;
        if (data.nutritionalInformation !== undefined) updateData.nutritional_information = data.nutritionalInformation;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.stockWarehouse !== undefined) updateData.stock_warehouse = data.stockWarehouse;
        if (data.stockShelfBottom !== undefined) updateData.stock_shelf_bottom = data.stockShelfBottom;
        if (data.minimumStock !== undefined) updateData.minimum_stock = data.minimumStock;
        if (data.minimumShelfStock !== undefined) updateData.minimum_shelf_stock = data.minimumShelfStock;
        if (data.categoryId !== undefined) updateData.category_id = data.categoryId;

        await productRepository.update(productId, updateData);

        // Log the update if there were actual changes
        if (Object.keys(updateData).length > 0) {
            const updatedProduct = await productRepository.findById(productId);
            if (updatedProduct) {
                await logService.createLog({
                    date: new Date(),
                    userId: userId,
                    productId: productId,
                    quantity: 0, // No stock movement for updates
                    reason: "Product updated",
                    action: ActionTypeEnum.UPDATE,
                    stockType: StockTypeEnum.WAREHOUSE,
                    stockWarehouseAfter: updatedProduct.stock_warehouse ?? 0,
                    stockShelfBottomAfter: updatedProduct.stock_shelf_bottom ?? 0,
                });
            }
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        return await this.enrichProductWithPromotion(product);
    }

    async deleteProduct(productId: number, userId: number): Promise<void> {
        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        // Log the deletion before actually deleting
        await logService.createLog({
            date: new Date(),
            userId: userId,
            productId: productId,
            quantity: 0,
            reason: "Product deleted",
            action: ActionTypeEnum.DELETE,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: 0,
            stockShelfBottomAfter: 0,
        });

        await productRepository.deleteById(productId);
    }

    /**
     * Add a certain `quantity` of products to the warehouse stock
     */
    async addToWarehouse(productId: number, quantity: number, userId: number): Promise<ProductResponseDto> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const newWarehouse = (product.stock_warehouse ?? 0) + quantity;
        await productRepository.update(productId, { stock_warehouse: newWarehouse });

        // Reload product
        const updated = await productRepository.findById(productId);
        if (!updated) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        // Log the operation
        await logService.createLog({
            date: new Date(),
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Add to warehouse",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: updated.stock_warehouse ?? 0,
            stockShelfBottomAfter: updated.stock_shelf_bottom ?? 0,
        });

        return await this.enrichProductWithPromotion(updated);
    }

    /**
     * Transfer stock from warehouse to shelf
     */
    async transferToShelf(productId: number, quantity: number, userId: number): Promise<ProductResponseDto> {
        // 1) Validate inputs
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const currentWarehouse = product.stock_warehouse ?? 0;
        if (currentWarehouse < quantity) {
            throw new Error("Not enough stock in warehouse");
        }

        const currentShelf = product.stock_shelf_bottom ?? 0;

        // 2) Calculate new stock levels
        const newWarehouse = currentWarehouse - quantity;
        const newShelf = currentShelf + quantity;

        // 3) Update in database
        await productRepository.update(productId, {
            stock_warehouse: newWarehouse,
            stock_shelf_bottom: newShelf,
        });

        // 4) Reload product
        const finalProduct = await productRepository.findById(productId);
        if (!finalProduct) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        // 5) Create logs
        const dateNow = new Date();

        // Log A: REMOVE_FROM WAREHOUSE
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Transfer from warehouse to shelf (out of warehouse)",
            action: ActionTypeEnum.REMOVE_FROM,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0,
        });

        // Log B: ADD_TO SHELF
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Transfer from warehouse to shelf (into shelf)",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.SHELF,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0,
        });

        return await this.enrichProductWithPromotion(finalProduct);
    }

    /**
     * Transfer stock from shelf to warehouse
     */
    async transferToWarehouse(productId: number, quantity: number, userId: number): Promise<ProductResponseDto> {
        // 1) Validate inputs
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const currentShelf = product.stock_shelf_bottom ?? 0;
        if (currentShelf < quantity) {
            throw new Error("Not enough stock on shelf");
        }

        const currentWarehouse = product.stock_warehouse ?? 0;
        const newShelf = currentShelf - quantity;
        const newWarehouse = currentWarehouse + quantity;

        // Update in database
        await productRepository.update(productId, {
            stock_shelf_bottom: newShelf,
            stock_warehouse: newWarehouse
        });

        // Reload product
        const finalProduct = await productRepository.findById(productId);
        if (!finalProduct) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        // Create logs
        const dateNow = new Date();

        // Log A: REMOVE_FROM SHELF
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Transfer from shelf to warehouse (out of shelf)",
            action: ActionTypeEnum.REMOVE_FROM,
            stockType: StockTypeEnum.SHELF,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        // Log B: ADD_TO WAREHOUSE
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Transfer from shelf to warehouse (into warehouse)",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        return await this.enrichProductWithPromotion(finalProduct);
    }

    /**
     * Transfer stock from warehouse to trash
     */
    async transferWarehouseToTrash(productId: number, quantity: number, userId: number): Promise<ProductResponseDto> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const currentWarehouse = product.stock_warehouse ?? 0;
        if (currentWarehouse < quantity) {
            throw new Error("Not enough stock in warehouse");
        }

        const newWarehouse = currentWarehouse - quantity;

        // Update in database
        await productRepository.update(productId, {
            stock_warehouse: newWarehouse,
        });

        // Reload product
        const finalProduct = await productRepository.findById(productId);
        if (!finalProduct) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        const dateNow = new Date();

        // Log A: REMOVE_FROM WAREHOUSE
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Warehouse to trash (out of warehouse)",
            action: ActionTypeEnum.REMOVE_FROM,
            stockType: StockTypeEnum.WAREHOUSE,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        // Log B: ADD_TO TRASH
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Warehouse to trash (into trash)",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.TRASH,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        return await this.enrichProductWithPromotion(finalProduct);
    }

    /**
     * Transfer stock from shelf to trash
     */
    async transferShelfToTrash(productId: number, quantity: number, userId: number): Promise<ProductResponseDto> {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const currentShelf = product.stock_shelf_bottom ?? 0;
        if (currentShelf < quantity) {
            throw new Error("Not enough stock on shelf");
        }

        const newShelf = currentShelf - quantity;

        // Update in database
        await productRepository.update(productId, {
            stock_shelf_bottom: newShelf,
        });

        // Reload product
        const finalProduct = await productRepository.findById(productId);
        if (!finalProduct) {
            throw new Error(`Product with ID ${productId} not found after update`);
        }

        const dateNow = new Date();

        // Log A: REMOVE_FROM SHELF
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Shelf to trash (out of shelf)",
            action: ActionTypeEnum.REMOVE_FROM,
            stockType: StockTypeEnum.SHELF,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        // Log B: ADD_TO TRASH
        await logService.createLog({
            date: dateNow,
            userId: userId,
            productId: productId,
            quantity: quantity,
            reason: "Shelf to trash (into trash)",
            action: ActionTypeEnum.ADD_TO,
            stockType: StockTypeEnum.TRASH,
            stockWarehouseAfter: finalProduct.stock_warehouse ?? 0,
            stockShelfBottomAfter: finalProduct.stock_shelf_bottom ?? 0
        });

        return await this.enrichProductWithPromotion(finalProduct);
    }

    /**
     * Get products with low stock (based on minimum_stock and minimum_shelf_stock)
     */
    async getProductsWithLowStock(): Promise<ProductResponseDto[]> {
        const client = (await import("../../../config/database.ts")).default.getClient();

        const query = `
      SELECT * FROM products 
      WHERE stock_warehouse < minimum_stock 
      OR stock_shelf_bottom < minimum_shelf_stock
    `;

        const result = await client.queryObject<Product>({ text: query });
        const products = result.rows;

        return await Promise.all(products.map(async (product) => this.enrichProductWithPromotion(product)));
    }

    /**
     * Helper method to enrich a product with its promotion information
     */
    private async enrichProductWithPromotion(product: Product): Promise<ProductResponseDto> {
        const { originalPrice, discountedPrice, promotion } = await promotionService.getProductPriceWithPromotion(product.product_id);

        return {
            id: product.product_id,
            ean: product.ean,
            name: product.name,
            brand: product.brand,
            description: product.description,
            picture: product.picture,
            nutritionalInformation: product.nutritional_information,
            price: originalPrice,
            stockWarehouse: product.stock_warehouse ?? 0,
            stockShelfBottom: product.stock_shelf_bottom ?? 0,
            minimumStock: product.minimum_stock,
            minimumShelfStock: product.minimum_shelf_stock,
            categoryId: product.category_id,
            promotion: promotion,
            finalPrice: discountedPrice ?? originalPrice
        };
    }
}

const productService = new ProductService();
export default productService;