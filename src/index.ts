import StockI from './interfaces/stock.interface';
import { TransactionI } from './interfaces/transaction.interface';
import fs, { promises } from 'fs';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json';
import ReadFile from './interfaces/misc.interface';

const readJSONFile = async <T>(fileName: string) => {
    const fileBuffer: Buffer = await promises.readFile(fileName);
    if(fileBuffer) {
        const jsonData: T = JSON.parse(fileBuffer.toString());
        return jsonData;
    }
}

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

const getSKULevels = async (sku: string): Promise<{sku: string, qty: number}> => {
    return new Promise(async (resolve, reject)=>{
            const stock: StockI[] | undefined = await readJSONFile<StockI[]>(
                `${__dirname}/static/stock.json`);

            const stockObj: StockI | undefined = stock?.find(o=> o.sku === sku);
            let stockLevel: number = stockObj?.stock ?? 0;
            let skuExists: boolean = false;

            // reading JSON line by line. In case of large data file this method is used to not overload RAM. 
            const stream = fs.createReadStream(__dirname+'/static/transactions.json')
                .pipe(parser()).pipe(streamArray());
            stream.on('data', (data: ReadFile)=>{
                const { value }: ReadFile = data;
                const { sku: transactionSKU }: TransactionI = value;
                if(transactionSKU === sku) {
                    skuExists = true;
                    stockLevel = calculate(value, stockLevel, reject);
                }
            });

            stream.on('end', ()=>{
                if(!skuExists && stockLevel === 0) {
                    reject('Error: SKU does not exist in the transactions.json and stock.json')
                } else {
                    resolve({ sku, qty: stockLevel })
                }
            })
    });
}


getSKULevels("NEWENTRY/68/09")
    .then((res)=> console.log(res))
    .catch((err)=> console.error(err));

export { getSKULevels, calculate };