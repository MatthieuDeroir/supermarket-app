// modules/addresses/address.controller.ts

import type { Context } from "../../deps.ts";
import { AddressesRepository } from "./dal/address.repository.ts";
import { AddressesService } from "./bll/address.service.ts";
import { AddressCreateDto } from "./dto/address-create.dto.ts";
import { AddressUpdateDto } from "./dto/address-update.dto.ts";

import { AddressResponseDto } from "./dto/address-response.dto.ts";

const repo = new AddressesRepository();
const service = new AddressesService(repo);

/**
 * POST /addresses
 * Create a new address
 */
export async function createAddressHandler(c: Context) {
    try {
        const body = await c.req.json();
        const dto = body as AddressCreateDto;

        const created = await service.createAddress(dto);

        // Optionally map `created` to a response DTO if needed
        const response: AddressResponseDto = {
            addressId: created.addressId,
            userId: created.userId,
            addressLine1: created.addressLine1,
            addressLine2: created.addressLine2,
            addressComplement: created.addressComplement,
            zipCode: created.zipCode,
            city: created.city,
            country: created.country,
        };

        return c.json(response, 201);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }
}

/**
 * GET /addresses/:id
 * Retrieve a specific address by its ID
 */
export async function getAddressHandler(c: Context) {
    try {
        const addressId = parseInt(c.req.param("id"), 10);
        if (Number.isNaN(addressId)) {
            return c.text("Invalid addressId", 400);
        }

        const address = await service.getAddressById(addressId);
        if (!address) {
            return c.text("Not found", 404);
        }

        // Optionally map to a response DTO
        const response: AddressResponseDto = {
            addressId: address.addressId,
            userId: address.userId,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            addressComplement: address.addressComplement,
            zipCode: address.zipCode,
            city: address.city,
            country: address.country,
        };

        return c.json(response);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }
}

/**
 * GET /addresses/user/:userId
 * Retrieve all addresses for a given user
 */
export async function getAddressesForUserHandler(c: Context) {
    try {
        const userId = parseInt(c.req.param("userId"), 10);
        if (Number.isNaN(userId)) {
            return c.text("Invalid userId", 400);
        }

        const addresses = await service.findAddressesByUser(userId);

        // You could map each address to a response DTO, e.g.:
        const response = addresses.map((addr) => ({
            addressId: addr.addressId,
            userId: addr.userId,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2,
            addressComplement: addr.addressComplement,
            zipCode: addr.zipCode,
            city: addr.city,
            country: addr.country,
        }));

        return c.json(response);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }
}

/**
 * PATCH /addresses/:id
 * Update an existing address
 */
export async function updateAddressHandler(c: Context) {
    try {
        const addressId = parseInt(c.req.param("id"), 10);
        if (Number.isNaN(addressId)) {
            return c.text("Invalid addressId", 400);
        }

        const body = await c.req.json();
        const dto: AddressUpdateDto = {
            addressId,
            ...body,
        };

        const updated = await service.updateAddress(dto);
        if (!updated) {
            return c.text("Not found", 404);
        }

        // map to a response if needed
        const response: AddressResponseDto = {
            addressId: updated.addressId,
            userId: updated.userId,
            addressLine1: updated.addressLine1,
            addressLine2: updated.addressLine2,
            addressComplement: updated.addressComplement,
            zipCode: updated.zipCode,
            city: updated.city,
            country: updated.country,
        };

        return c.json(response);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }
}

/**
 * DELETE /addresses/:id
 * Hard-delete an address
 */
export async function deleteAddressHandler(c: Context) {
    try {
        const addressId = parseInt(c.req.param("id"), 10);
        if (Number.isNaN(addressId)) {
            return c.text("Invalid addressId", 400);
        }

        const success = await service.deleteAddress(addressId);
        if (!success) {
            return c.text("Not found", 404);
        }

        return c.text("Deleted", 200);
    } catch (err) {
        if (err instanceof Error) {
            return c.text(err.message, 400);
        } else {
            return c.text("Unknown error", 400);
        }
    }
}
