import { ActionTypeEnum } from "../../enums/actionTypeEnum.ts";
import { StockTypeEnum } from "../../enums/stockTypeEnum.ts";

// modules/logs/log.model.ts
export interface Log {
    [key: string]: unknown; // <= index signature
    logId: number;
    date: Date;
    userId: number;
    productId: string;
    quantity: number;
    reason: string;
    action: ActionTypeEnum;
    stockType: StockTypeEnum;
}
