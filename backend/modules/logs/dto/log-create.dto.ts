// modules/logs/dto/log-create.dto.ts
export interface LogCreateDto {
    userId: number;
    productId: number;
    stockTypeId: number;
    actionId: number;
    quantity: number;
    operation: string;
    reason: string;
}