// modules/carts/cart.controller.ts
import { Hono } from "hono";
import { cartService } from "./bll/cart.service.ts";

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

export default cartController;
