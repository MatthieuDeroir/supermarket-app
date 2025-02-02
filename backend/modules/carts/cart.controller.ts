// modules/carts/cart.controller.ts
import { Hono } from "hono";
import cartService from "./bll/cart.service.ts";

// Au tout début de votre fichier product.controller.ts (ou dans un fichier d'inclusion global)
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}


const cartController = new Hono();

/**
 * GET /carts
 * - Récupère tous les paniers
 */
cartController.get("/", async (c) => {
    const userId = c.get("userId");
    console.log("userId récupéré depuis le JWT: ", userId);

    const carts = await cartService.getAllCarts();
    return c.json(carts);
});

/**
 * GET /carts/:cartId
 * - Récupère un panier par son ID
 */
cartController.get("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    const cart = await cartService.getCartById(cartId);

    if (!cart) {
        return c.json({ message: "Cart not found" }, 404);
    }
    return c.json(cart);
});

/**
 * POST /carts
 * - Crée un nouveau panier
 */
cartController.post("/", async (c) => {
    let body;
    try {
        body = await c.req.json(); // tente de parser le JSON
    } catch (_err) {
        return c.json({ error: "Invalid or empty JSON body" }, 400);
    }

    // Optionnel : Assurez-vous que les champs obligatoires sont présents
    // if (!body.someField) {
    //   return c.json({ error: "Missing someField" }, 400);
    // }

    // Si nécessaire, on peut injecter userId dans body :
    // const userId = c.get("userId") as number;
    // body.user_id = userId;

    await cartService.createCart(body);
    return c.json({ message: "Cart created" }, 201);
});

/**
 * PUT /carts/:cartId
 * - Met à jour un panier existant
 */
cartController.put("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));

    let body;
    try {
        body = await c.req.json();
    } catch (_err) {
        return c.json({ error: "Invalid or empty JSON body" }, 400);
    }

    await cartService.updateCart(cartId, body);
    return c.json({ message: "Cart updated" });
});

/**
 * DELETE /carts/:cartId
 * - Supprime un panier par son ID
 */
cartController.delete("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));

    await cartService.deleteCart(cartId);
    return c.json({ message: "Cart deleted" });
});

/**
 * POST /carts/:cartId/pay
 * - Valide le paiement du panier (ex. payement effectif, création invoice, etc.)
 */
cartController.post("/:cartId/pay", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    const userId = c.get("userId") ?? 1 ;


    let body;
    try {
        body = await c.req.json();
    } catch (_err) {
        return c.json({ error: "Invalid or empty JSON body" }, 400);
    }

    const { addressId } = body;
    if (!addressId) {
        return c.json({ error: "Missing addressId in request body" }, 400);
    }

    try {
        await cartService.payCart(cartId, userId, addressId);
        return c.json({
            message: `Cart ${cartId} paid by user ${userId} with address ${addressId}`,
        });
    } catch (err) {
        return c.json({ error: err }, 400);
    }
});

/**
 * POST /carts/lines
 * - Ajoute un produit dans le panier actif de l'utilisateur
 */
cartController.post("/lines", async (c) => {
    let body;
    try {
        body = await c.req.json();
    } catch (_err) {
        return c.json({ error: "Invalid or empty JSON body" }, 400);
    }

    const { productId, quantity } = body;
    const userId = c.get("userId") as number;

    // Vérification basique
    if (typeof productId !== "number" || typeof quantity !== "number") {
        return c.json({ error: "productId and quantity must be numbers" }, 400);
    }

    try {
        const newLine = await cartService.addProductToCart(productId, quantity, userId);
        return c.json(newLine, 201);
    } catch (_err) {
        return c.json({ message: "Erreur dans l'ajout du produit" }, 400);
    }
});

/**
 * DELETE /carts/:cartId/lines/:cartLineId
 * - Supprime une ligne du panier
 */
cartController.delete("/:cartId/lines/:cartLineId", async (c) => {
    const cartLineId = Number(c.req.param("cartLineId"));
    const userId = c.get("userId");

    try {
        await cartService.removeCartLine(cartLineId, userId);
        return c.json({ message: `CartLine ${cartLineId} removed for user ${userId}` });
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

export default cartController;
