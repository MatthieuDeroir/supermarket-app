// product.service.test.ts
import { productService } from "../../modules/products/bll/product.service.ts";
import { assertEquals, assertRejects } from "https://deno.land/std@0.192.0/testing/asserts.ts";

// On mock le repository et le logService
import productRepository from "../../modules/products/dal/product.repository.ts";
import logService from "../../modules/logs/bll/log.service.ts";

Deno.test("addToWarehouse → should increment warehouse stock and create a log", async () => {
    // 1) On prépare un faux produit renvoyé par findById
    const fakeProduct = {
        product_id: 10,
        stock_warehouse: 100,
        stock_shelf_bottom: 20,
        // ...
    };
    // 2) On mock productRepository
    // findById => renvoie le fakeProduct
    // update => ne fait rien, ou renvoie un promise<undefined>
    (productRepository.findById as jest.Mock).mockResolvedValueOnce(fakeProduct);

    // 3) On appelle la fonction addToWarehouse
    const newQuantity = 50;
    const userId = 999;
    const updatedProduct = await productService.addToWarehouse(10, newQuantity, userId);

    // 4) Vérifications
    // On s’attend à ce que update ait été appelé avec { stock_warehouse: 150 }
    expect(productRepository.update).toHaveBeenCalledWith(
        10,
        expect.objectContaining({ stock_warehouse: 150 }),
    );

    // On s’attend à ce que createLog ait été appelé
    expect(logService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
            user_id: 999,
            quantity: 50,
            action: "ADD_TO",
            stock_warehouse_after: 150,
            // ...
        })
    );

    // On vérifie la valeur de retour
    expect(updatedProduct?.stock_warehouse).toBe(150);
});

Deno.test("addToWarehouse → should throw error if quantity <= 0", async () => {
    await assertRejects(
        () => productService.addToWarehouse(10, -5, 999),
        Error,
        "Quantity must be positive"
    );
});
