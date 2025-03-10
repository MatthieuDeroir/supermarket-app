
// Close shop DTO
export interface CloseShopResponseDto {
    success: boolean;
    cartsProcessed: number;
    productsReturned: number;
    failedCarts?: string[];
}