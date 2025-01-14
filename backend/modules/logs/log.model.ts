// modules/logs/log.model.ts
export interface Log {
    stockLogId: number;
    date: Date;
    userId: number;
    productId: string;
    stockTypeId: number;
    actionId: number;
    quantity: number;
    operation: string;
    reason: string;
}