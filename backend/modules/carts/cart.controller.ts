// modules/carts/cart.controller.ts
import { Hono } from "hono";
import cartService from "./bll/cart.service.ts";

const cartController = new Hono();

// GET /cart
cartController.get("/", async (c) => {
    const carts = await cartService.getAllCarts();
    return c.json(carts);
});

// GET /cart/:cartId
cartController.get("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
        return c.json({ message: "Cart not found" }, 404);
    }
    return c.json(cart);
});

// POST /cart
cartController.post("/", async (c) => {
    const body = await c.req.json();
    await cartService.createCart(body);
    return c.json({ message: "Cart created" }, 201);
});

// PUT /cart/:cartId
cartController.put("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    const body = await c.req.json();
    await cartService.updateCart(cartId, body);
    return c.json({ message: "Cart updated" });
});

// DELETE /cart/:cartId
cartController.delete("/:cartId", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    await cartService.deleteCart(cartId);
    return c.json({ message: "Cart deleted" });
});

// POST /cart/:cartId/pay
cartController.post("/:cartId/pay", async (c) => {
    const cartId = Number(c.req.param("cartId"));


    // TODO: plus tard, récupérer userId depuis le JWT
    // ex.: const userId = c.get("userId");
    // Pour l'instant, on met un dummy
    const userId = 1; // ou parseInt(...) ?
    const addressId = 2;

    try {
        await cartService.payCart(cartId, userId, addressId);
        return c.json({ message: `Cart ${cartId} paid` });
    } catch (err) {
        return c.json({ error: err }, 400);
    }
});

// POST /carts/lines
cartController.post("/lines", async (c) => {
    const cartId = Number(c.req.param("cartId"));
    const { productId, quantity } = await c.req.json();
    console.log(productId, quantity);
    // plus tard, on récupérera userId depuis le JWT
    const userId = 1;

    try {
        const newLine = await cartService.addProductToCart(productId, quantity, userId);
        return c.json(newLine, 201);
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

// DELETE /cart/:cartId/lines/:cartLineId
cartController.delete("/:cartId/lines/:cartLineId", async (c) => {
    const cartLineId = Number(c.req.param("cartLineId"));
    const userId = 1;

    try {
        console.log(`Removing CartLine ${cartLineId}`);
        await cartService.removeCartLine(cartLineId, userId);
        console.log(`CartLine ${cartLineId} removed`);
        return c.json({ message: `CartLine ${cartLineId} removed` });
    } catch (err) {
        return c.json({ message: err }, 400);
    }
});

export default cartController;
