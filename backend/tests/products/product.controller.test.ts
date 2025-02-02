// product.controller.test.ts
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
    stub,
    assertSpyCalls
} from "https://deno.land/std@0.192.0/testing/mock.ts";

import { Hono } from "hono";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";

// On mock le productService pour ne pas faire de vraies requêtes DB
import { productService } from "../../modules/products/bll/product.service.ts";

// Import du controller
import productController from "../../modules/products/product.controller.ts";
import {Product} from "../../modules/products/product.model.ts";

Deno.test("GET /product → should return 200 and an array of products", async () => {
    // 1) On prépare un tableau de produits factices
    const mockProducts = [
        { product_id: 1, name: "Fake product", ean: "123456" },
    ] as Product[];

    // 2) On 'stub' la méthode getAllProducts du productService
    //    Elle renvoie ici un mockProducts directement
    const getAllStub = stub(
        productService,
        "getAllProducts",
        () => Promise.resolve(mockProducts),
    );

    // 3) On crée une app Hono pour brancher productController
    const app = new Hono();
    app.route("/product", productController);

    // 4) On lance la requête via SuperDeno
    const request = await superdeno(app)
        .get("/product")
        .expect("Content-Type", /application\/json/)
        .expect(200);

    // 5) On vérifie la réponse JSON
    const body = request.body;
    assertEquals(body, mockProducts);

    // 6) On vérifie que productService.getAllProducts a été appelé
    assertSpyCalls(getAllStub, 1);

    // 7) On restaure la méthode originale pour ne pas polluer d'autres tests
    getAllStub.restore();
});
