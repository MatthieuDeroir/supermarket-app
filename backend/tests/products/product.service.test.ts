import { productService } from "../../modules/products/bll/product.service.ts";
import {
    assertEquals,
    assertRejects,
    assertObjectMatch,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import productRepository from "../../modules/products/dal/product.repository.ts";
import logService from "../../modules/logs/bll/log.service.ts";
import { Product } from "../../modules/products/product.model.ts";

// Test de getAllProducts
Deno.test("getAllProducts returns all products", async () => {
    const mockProducts: Product[] = [
        {
            product_id: 1,
            name: "Product 1",
            ean: "123",
            brand: "Brand1",
            description: "Desc",
            picture: "pic",
            nutritional_information: "{}",
            price: 10,
            stock_warehouse: 100,
            stock_shelf_bottom: 50,
            minimum_stock: 10,
            minimum_shelf_stock: 5,
            category_id: 1,
        },
        {
            product_id: 2,
            name: "Product 2",
            ean: "456",
            brand: "Brand2",
            description: "Desc",
            picture: "pic",
            nutritional_information: "{}",
            price: 20,
            stock_warehouse: 200,
            stock_shelf_bottom: 100,
            minimum_stock: 20,
            minimum_shelf_stock: 10,
            category_id: 2,
        },
    ];
    const stubFindAll = stub(productRepository, "findAll", () =>
        Promise.resolve(mockProducts)
    );
    const result = await productService.getAllProducts();
    assertEquals(result, mockProducts);
    assertSpyCalls(stubFindAll, 1);
    stubFindAll.restore();
});

// Test de getProductById retourne un produit si trouvé
Deno.test("getProductById returns product if exists", async () => {
    const mockProduct: Product = {
        product_id: 1,
        name: "Product 1",
        ean: "123",
        brand: "Brand1",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 100,
        stock_shelf_bottom: 50,
        minimum_stock: 10,
        minimum_shelf_stock: 5,
        category_id: 1,
    };
    const stubFindById = stub(
        productRepository,
        "findById",
        (pk: unknown) => {
            const _id = pk as number;
            return Promise.resolve(mockProduct);
        }
    );
    const result = await productService.getProductById(1);
    assertEquals(result, mockProduct);
    assertSpyCalls(stubFindById, 1);
    stubFindById.restore();
});

// Test de getProductById retourne null si non trouvé
Deno.test("getProductById returns null if not found", async () => {
    const stubFindById = stub(
        productRepository,
        "findById",
        (pk: unknown) => Promise.resolve(null)
    );
    const result = await productService.getProductById(999);
    assertEquals(result, null);
    assertSpyCalls(stubFindById, 1);
    stubFindById.restore();
});

// Test de createProduct
Deno.test("createProduct creates a product and logs creation", async () => {
    const newProductData = {
        ean: "789",
        name: "New Product",
        brand: "BrandNew",
        description: "New desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 30,
        stock_warehouse: 300,
        stock_shelf_bottom: 150,
        minimum_stock: 30,
        minimum_shelf_stock: 15,
        category_id: 3,
    };
    const createdProduct: Product = { product_id: 10, ...newProductData };
    const userId = 1;
    const stubCreateReturningId = stub(
        productRepository,
        "createReturningId",
        (_data: Partial<Product>) => Promise.resolve(10)
    );
    const stubFindById = stub(
        productRepository,
        "findById",
        (pk: unknown) => {
            const id = pk as number;
            return Promise.resolve(createdProduct);
        }
    );
    const stubCreateLog = stub(
        logService,
        "createLog",
        () => Promise.resolve()
    );
    await productService.createProduct(newProductData, userId);
    assertSpyCalls(stubCreateReturningId, 1);
    assertSpyCalls(stubFindById, 1);
    assertSpyCalls(stubCreateLog, 1);
    stubCreateReturningId.restore();
    stubFindById.restore();
    stubCreateLog.restore();
});

// Test de updateProduct
Deno.test("updateProduct calls repository update", async () => {
    const stubUpdate = stub(
        productRepository,
        "update",
        (pk: unknown, _data: any) => Promise.resolve()
    );
    await productService.updateProduct(1, { name: "Updated" });
    assertSpyCalls(stubUpdate, 1);
    stubUpdate.restore();
});

// Test de deleteProduct
Deno.test("deleteProduct calls repository deleteById", async () => {
    const stubDelete = stub(
        productRepository,
        "deleteById",
        (pk: unknown) => Promise.resolve()
    );
    await productService.deleteProduct(1);
    assertSpyCalls(stubDelete, 1);
    stubDelete.restore();
});

// Note: Les tests pour addToWarehouse et autres fonctions de transfert doivent être ajustés de la même manière.
// Voici un exemple pour addToWarehouse :

Deno.test("addToWarehouse → should increment warehouse stock and create a log", async () => {
    const newQuantity = 50;
    const userId = 999;
    const fakeProduct = {
        product_id: 10,
        stock_warehouse: 100,
        stock_shelf_bottom: 20,
    } as Product;

    let findByIdCallCount = 0;
    const stubFindById = stub(
        productRepository,
        "findById",
        (pk: unknown) => {
            findByIdCallCount++;
            if (findByIdCallCount === 1) {
                return Promise.resolve(fakeProduct);
            } else {
                return Promise.resolve({
                    ...fakeProduct,
                    stock_warehouse: fakeProduct.stock_warehouse + newQuantity,
                });
            }
        }
    );

    const stubUpdate = stub(
        productRepository,
        "update",
        (pk: unknown, _data: any) => Promise.resolve()
    );

    const stubLog = stub(
        logService,
        "createLog",
        () => Promise.resolve()
    );

    const updatedProduct = await productService.addToWarehouse(10, newQuantity, userId);

    assertSpyCalls(stubUpdate, 1);
    assertEquals(stubUpdate.calls[0].args, [10, { stock_warehouse: 150 }]);

    assertSpyCalls(stubLog, 1);
    const logArg = stubLog.calls[0].args[0];
    assertObjectMatch(logArg, {
        user_id: userId,
        quantity: newQuantity,
        action: "ADD_TO",
        stock_warehouse_after: 150,
    });

    assertEquals(updatedProduct?.stock_warehouse, 150);

    stubFindById.restore();
    stubUpdate.restore();
    stubLog.restore();
});

// Test de addToWarehouse pour vérifier qu'une quantité négative lance une erreur
Deno.test("addToWarehouse → should throw error if quantity <= 0", async () => {
    await assertRejects(
        () => productService.addToWarehouse(10, -5, 999),
        Error,
        "Quantity must be positive"
    );
});
