// modules/users/user.controller.ts
import { Hono } from "hono";
import { userService } from "./bll/user.service.ts";

const userController = new Hono();

// GET /user
userController.get("/", async (c) => {
    const users = await userService.getAllUsers();
    return c.json(users);
});

// GET /user/:userId
userController.get("/:userId", async (c) => {
    const userId = Number(c.req.param("userId"));
    const user = await userService.getUserById(userId);
    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }
    return c.json(user);
});

// POST /user
userController.post("/", async (c) => {
    const body = await c.req.json();
    await userService.createUser(body);
    return c.json({ message: "User created" }, 201);
});

// PUT /user/:userId
userController.put("/:userId", async (c) => {
    const userId = Number(c.req.param("userId"));
    const body = await c.req.json();
    await userService.updateUser(userId, body);
    return c.json({ message: "User updated" });
});

// DELETE /user/:userId
userController.delete("/:userId", async (c) => {
    const userId = Number(c.req.param("userId"));
    await userService.deleteUser(userId);
    return c.json({ message: "User deleted" });
});

export default userController;
