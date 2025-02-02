// product.service.test.ts
import { productService } from "../../modules/products/bll/product.service.ts";
import {
    assertEquals,
    assertRejects,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
    stub,
    assertSpyCalls,
    assertSpyCall,
    assertSpyCallArg,
} from "https://deno.land/std@0.192.0/testing/mock.ts";

// Ex. 2.30.0
import { format } from "https://deno.land/x/date_fns@2.30.0/index.js";

const formatted = format(new Date(), "yyyy-MM-dd");
console.log(formatted);


// On mock/stub le repository et le logService
import productRepository from "../../modules/products/dal/product.repository.ts";
import logService from "../../modules/logs/bll/log.service.ts";
import { Product } from "../../modules/products/product.model.ts";

Deno.test("addToWarehouse → should increment warehouse stock and create a log", async () => {
    // Préparer un faux produit renvoyé par findById
    const fakeProduct = {
        product_id: 10,
        stock_warehouse: 100,
        stock_shelf_bottom: 20,
        // autres champs si besoin
    } as Product;

    // Stub des méthodes du repository
    const findByIdStub = stub(
        productRepository,
        "findById",
        () => Promise.resolve(fakeProduct), // renvoie le fakeProduct
    );
    const updateStub = stub(
        productRepository,
        "update",
        () => Promise.resolve(), // ne fait rien, simule l'update
    );

    // Stub de logService.createLog
    const logStub = stub(
        logService,
        "createLog",
        () => Promise.resolve(),
    );

    // ======= TEST =======
    const newQuantity = 50;
    const userId = 999;
    const updatedProduct = await productService.addToWarehouse(10, newQuantity, userId);

    // Vérifier que productRepository.update a été appelé 1 fois
    assertSpyCalls(updateStub, 1);
    // Vérifier précisément les arguments du 1er appel
    //  - product_id = 10
    //  - data = { stock_warehouse: 150 }
    assertSpyCall(updateStub, 0, {
        args: [10, { stock_warehouse: 150 }],
    });

    // Vérifier que logService.createLog a été appelé 1 fois
    assertSpyCalls(logStub, 1);
    // Vérifier certains arguments du log
    assertSpyCallArg(logStub, 0, 0, {
        user_id: 999,
        quantity: 50,
        action: "ADD_TO",
        stock_warehouse_after: 150,
    });
    // ^ Ici, on pourrait vérifier plus de champs si besoin

    // Vérifier la valeur de retour
    assertEquals(updatedProduct?.stock_warehouse, 150);

    // Nettoyage: restaurer les fonctions originales
    findByIdStub.restore();
    updateStub.restore();
    logStub.restore();
});

Deno.test("addToWarehouse → should throw error if quantity <= 0", async () => {
    // Pas besoin de stubs ici, on teste juste la validation
    await assertRejects(
        () => productService.addToWarehouse(10, -5, 999),
        Error,
        "Quantity must be positive",
    );
});
