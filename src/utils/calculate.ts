import { TransactionI } from "../interfaces/transaction.interface";

const calculate = (value: TransactionI, stockLevel: number, reject: Function): number => {
    const { qty, type }: TransactionI = value;
    if(type === 'order') {
        const result = stockLevel - (qty ?? 0);
        if(result<0) {
            reject('Cannot place order - stock level low')
        }
        return result;
    } else if(type === 'refund') {
        return stockLevel  + (qty ?? 0);
    }
    return stockLevel;
}

export default calculate;