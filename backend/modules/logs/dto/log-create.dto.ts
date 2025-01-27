// modules/logs/dto/log-create.dto.ts
export interface LogCreateDto {
    userId: number;
    productId: string;
    stockTypeId: number;
    actionId: number;
    quantity: number;
    operation: string;
    reason: string;
}