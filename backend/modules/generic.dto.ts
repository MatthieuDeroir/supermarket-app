// Base DTO interfaces

// Common response DTO interface
export interface BaseResponseDto {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Common create DTO interface
// deno-lint-ignore no-empty-interface
export interface BaseCreateDto {
    // Any common fields for creation
}

// Common update DTO interface
// deno-lint-ignore no-empty-interface
export interface BaseUpdateDto {
    // Any common fields for updates
}