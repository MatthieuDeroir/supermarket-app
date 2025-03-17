// Cart DTOs
import {BaseCreateDto, BaseResponseDto, BaseUpdateDto} from "../../generic.dto.ts";
import {CartLineResponseDto} from "./cartline.dto.ts";

export interface CartResponseDto extends BaseResponseDto {
    id: number; // Renamed from cartId
    userId: number;
    payed: boolean;
    createdAt: Date;
    payedAt?: Date | null;
    lines: CartLineResponseDto[];
    total?: number;
}

export interface CartCreateDto extends BaseCreateDto {
    userId: number;
}

export interface CartUpdateDto extends BaseUpdateDto {
    payed?: boolean;
    payedAt?: Date;
}