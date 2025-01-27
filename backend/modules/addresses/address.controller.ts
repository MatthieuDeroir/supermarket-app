import { Hono } from "hono";
import addressService from "./bll/address.service.ts"; // Import de l'instance

const addressController = new Hono();

// GET /address
addressController.get("/", async (c) => {
    const addresses = await addressService.getAllAddress();
    return c.json(addresses);
});

// GET /address/:addressId
addressController.get("/:addressId", async (c) => {
    const addressId = Number(c.req.param("addressId"));
    const address = await addressService.getAddressById(addressId);
    if (!address) {
        return c.json({ message: "Address not found" }, 404);
    }
    return c.json(address);
});

// POST /address
addressController.post("/", async (c) => {
    const body = await c.req.json();
    await addressService.createAddress(body);
    return c.json({ message: "Address created" }, 201);
});

// PUT /address/:addressId
addressController.put("/:addressId", async (c) => {
    const addressId = Number(c.req.param("addressId"));
    const body = await c.req.json();
    await addressService.updateAddress(addressId, body);
    return c.json({ message: "Address updated" });
});

// DELETE /address/:addressId
addressController.delete("/:addressId", async (c) => {
    const addressId = Number(c.req.param("addressId"));
    await addressService.deleteAddress(addressId);
    return c.json({ message: "Address deleted" });
});

export default addressController;
