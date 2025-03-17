// tests/products/product.controller.test.ts

// Pour éviter l'erreur "window is not defined" dans SuperDeno
if (typeof window === "undefined") {
    (globalThis as any).window = globalThis;
}

import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { stub, assertSpyCalls } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";

// On importe le service pour le stubmer (on simule son comportement)
import { productService } from "../../modules/products/bll/product.service.ts";
// Import du contrôleur
import productController from "../../modules/products/product.controller.ts";
// Import du type Product
import { Product } from "../../modules/products/product.model.ts";

// Test GET /product : récupération de la liste des produits
Deno.test("GET /product returns array of products", async () => {
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
    ];
    const stubGetAll = stub(
        productService,
        "getAllProducts",
        () => Promise.resolve(mockProducts),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/product")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, mockProducts);
    assertSpyCalls(stubGetAll, 1);
    stubGetAll.restore();
});

// Test GET /product/:product_id quand le produit existe
Deno.test("GET /product/:product_id returns product when found", async () => {
    const mockProduct: Product = {
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
    };
    const stubGetById = stub(
        productService,
        "getProductById",
        (_id: number) => Promise.resolve(mockProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/product/2")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, mockProduct);
    assertSpyCalls(stubGetById, 1);
    stubGetById.restore();
});

// Test GET /product/:product_id quand le produit n'existe pas
Deno.test("GET /product/:product_id returns 404 when not found", async () => {
    const stubGetById = stub(
        productService,
        "getProductById",
        (_id: number) => Promise.resolve(null),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .get("/product/999")
        .expect("Content-Type", /application\/json/)
        .expect(404);
    assertEquals(res.body, { message: "Product not found" });
    assertSpyCalls(stubGetById, 1);
    stubGetById.restore();
});

// Test POST /product : création d'un produit
Deno.test("POST /product creates a product", async () => {
    const stubCreate = stub(
        productService,
        "createProduct",
        (_data: any, _user_id: number) => Promise.resolve(),
    );
    const app = new Hono();
    app.route("/product", productController);
    const productData = {
        ean: "789",
        name: "New Product",
        brand: "Brand3",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 30,
        stock_warehouse: 300,
        stock_shelf_bottom: 150,
        minimum_stock: 30,
        minimum_shelf_stock: 15,
        category_id: 3,
    };
    const res = await superdeno(app.fetch.bind(app))
        .post("/product")
        .send(productData)
        .expect("Content-Type", /application\/json/)
        .expect(201);
    assertEquals(res.body, { message: "Product created" });
    assertSpyCalls(stubCreate, 1);
    stubCreate.restore();
});

// Test PUT /product/:product_id : mise à jour d'un produit
Deno.test("PUT /product/:product_id updates a product", async () => {
    const stubUpdate = stub(
        productService,
        "updateProduct",
        (_id: number, _data: any) => Promise.resolve(),
    );
    const app = new Hono();
    app.route("/product", productController);
    const updateData = { name: "Updated Product" };
    const res = await superdeno(app.fetch.bind(app))
        .put("/product/1")
        .send(updateData)
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, { message: "Product updated" });
    assertSpyCalls(stubUpdate, 1);
    stubUpdate.restore();
});

// Test DELETE /product/:product_id : suppression d'un produit
Deno.test("DELETE /product/:product_id deletes a product", async () => {
    const stubDelete = stub(
        productService,
        "deleteProduct",
        (_id: number) => Promise.resolve(),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .delete("/product/1")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, { message: "Product deleted" });
    assertSpyCalls(stubDelete, 1);
    stubDelete.restore();
});

// Test POST /products/:productId/add-to-warehouse
Deno.test("POST /product/:productId/add-to-warehouse returns updated product", async () => {
    const updatedProduct: Product = {
        product_id: 1,
        name: "Product",
        ean: "123",
        brand: "Brand",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 150, // 100 initial + 50 added
        stock_shelf_bottom: 50,
        minimum_stock: 5,
        minimum_shelf_stock: 2,
        category_id: 1,
    };
    const stubAddToWarehouse = stub(
        productService,
        "addToWarehouse",
        (_id: number, _quantity: number, _user_id: number) => Promise.resolve(updatedProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/add-to-warehouse")
        .send({ quantity: 50 })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, updatedProduct);
    assertSpyCalls(stubAddToWarehouse, 1);
    stubAddToWarehouse.restore();
});

Deno.test("POST /product/:productId/add-to-warehouse returns error when service fails", async () => {
    const errorMessage = "Test error";
    const stubAddToWarehouse = stub(
        productService,
        "addToWarehouse",
        () => Promise.reject(new Error(errorMessage)),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/add-to-warehouse")
        .send({ quantity: 50 })
        .expect("Content-Type", /application\/json/)
        .expect(400);
    // On attend que la réponse soit { message: "Test error" }
    assertEquals(res.body, { message: errorMessage });
    assertSpyCalls(stubAddToWarehouse, 1);
    stubAddToWarehouse.restore();
});


// Test POST /product/1/warehouse-to-shelf
Deno.test("POST /product/1/warehouse-to-shelf returns updated product", async () => {
    const updatedProduct: Product = {
        product_id: 1,
        name: "Product",
        ean: "123",
        brand: "Brand",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 80,  // Exemple : 100 - 20
        stock_shelf_bottom: 70, // Exemple : 50 + 20
        minimum_stock: 5,
        minimum_shelf_stock: 2,
        category_id: 1,
    };
    const stubTransferToShelf = stub(
        productService,
        "transferToShelf",
        () => Promise.resolve(updatedProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/warehouse-to-shelf")
        .send({ quantity: 20 })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, updatedProduct);
    assertSpyCalls(stubTransferToShelf, 1);
    stubTransferToShelf.restore();
});

// Test POST /product/1/shelf-to-warehouse
Deno.test("POST /product/1/shelf-to-warehouse returns updated product", async () => {
    const updatedProduct: Product = {
        product_id: 1,
        name: "Product",
        ean: "123",
        brand: "Brand",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 120, // Exemple : 100 + 20
        stock_shelf_bottom: 30, // Exemple : 50 - 20
        minimum_stock: 5,
        minimum_shelf_stock: 2,
        category_id: 1,
    };
    const stubTransferToWarehouse = stub(
        productService,
        "transferToWarehouse",
        () => Promise.resolve(updatedProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/shelf-to-warehouse")
        .send({ quantity: 20 })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, updatedProduct);
    assertSpyCalls(stubTransferToWarehouse, 1);
    stubTransferToWarehouse.restore();
});

// Pour les endpoints "warehouse-to-trash" et "shelf-to-trash", le contrôleur appelle productService.transferToShelf.
Deno.test("POST /product/1/warehouse-to-trash returns updated product", async () => {
    const updatedProduct: Product = {
        product_id: 1,
        name: "Product",
        ean: "123",
        brand: "Brand",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 80,
        stock_shelf_bottom: 50,
        minimum_stock: 5,
        minimum_shelf_stock: 2,
        category_id: 1,
    };
    const stubTransferToShelf = stub(
        productService,
        "transferToShelf",
        () => Promise.resolve(updatedProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/warehouse-to-trash")
        .send({ quantity: 20 })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, updatedProduct);
    assertSpyCalls(stubTransferToShelf, 1);
    stubTransferToShelf.restore();
});

Deno.test("POST /product/1/shelf-to-trash returns updated product", async () => {
    const updatedProduct: Product = {
        product_id: 1,
        name: "Product",
        ean: "123",
        brand: "Brand",
        description: "Desc",
        picture: "pic",
        nutritional_information: "{}",
        price: 10,
        stock_warehouse: 120,
        stock_shelf_bottom: 30,
        minimum_stock: 5,
        minimum_shelf_stock: 2,
        category_id: 1,
    };
    const stubTransferToShelf = stub(
        productService,
        "transferToShelf",
        () => Promise.resolve(updatedProduct),
    );
    const app = new Hono();
    app.route("/product", productController);
    const res = await superdeno(app.fetch.bind(app))
        .post("/product/1/shelf-to-trash")
        .send({ quantity: 20 })
        .expect("Content-Type", /application\/json/)
        .expect(200);
    assertEquals(res.body, updatedProduct);
    assertSpyCalls(stubTransferToShelf, 1);
    stubTransferToShelf.restore();
});
