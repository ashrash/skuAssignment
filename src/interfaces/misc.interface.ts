import { TransactionI } from "./transaction.interface";

export interface ReadFile {
    key: number;
    value: TransactionI
}

export interface SkuData {
    sku: string;
    qty: number;
}
