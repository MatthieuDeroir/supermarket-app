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
    stock_warehouse_after?: number;       // état du stock en warehouse après mouvement
    stock_shelf_bottom_after?: number;    // état du fond de rayon après mouvement
    action: ActionTypeEnum;
    stockType: StockTypeEnum;
}
