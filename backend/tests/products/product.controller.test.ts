// product.controller.test.ts
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";

// On mock le productService pour ne pas faire de vraies requêtes DB.
import { productService } from "../bll/product.service.ts";

// Import du controller
import productController from "../product.controller.ts";

Deno.test("GET /product → should return 200 and an array of products", async () => {
    // 1) On mock la réponse de productService.getAllProducts()
    const mockProducts = [
        { product_id: 1, name: "Fake product", ean: "123456", ... },
    ];
    // On espionne (spy) ou on mock
    const getAllSpy = spyOn(productService, "getAllProducts").and.resolveTo(mockProducts);

    // 2) Créer une app Hono pour brancher productController
    const app = new Hono();
    // /product sera le prefix, ex: GET /product
    app.route("/product", productController);

    // 3) Lancer la requête via SuperDeno
    const request = await superdeno(app)
        .get("/product")     // <— route GET /product
        .expect("Content-Type", /application\/json/)
        .expect(200);

    // 4) Vérifier la réponse
    const body = request.body;
    assertEquals(body, mockProducts);

    // 5) Vérifier qu’on a bien appelé productService.getAllProducts
    assertEquals(getAllSpy.calls.length, 1);
});
