/* eslint-disable no-async-promise-executor */
import { logger } from '../utils/logger';
import fs from 'fs';
import StockI from '../interfaces/stock.interface';
import readJSONFile from '../utils/readFile';
import calculate from '../utils/calculate';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json';
import { ReadFile, SkuData } from '../interfaces/misc.interface';
import { TransactionI } from '../interfaces/transaction.interface';

class SKUService {

  getSKULevels = async (sku: string): Promise<SkuData> => {
    return new Promise(async (resolve, reject)=>{
          logger.info(`Getting levels for SKU code: ${sku}`);
          const stock: StockI[] | undefined = await readJSONFile<StockI[]>(
              `${__dirname}/../static/stock.json`);
          
          const stockObj: StockI | undefined = stock?.find(o=> o.sku === sku);
          let stockLevel: number = stockObj?.stock ?? 0;
          let skuExists = false;

          // reading JSON line by line. In case of large data file this method is used to not overload RAM. 
          const stream = fs.createReadStream(__dirname+'/../static/transactions.json')
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
                  logger.error(`Error: SKU does not exist in the transactions.json and stock.json for ${sku}`);
                  reject('Error: SKU does not exist in the transactions.json and stock.json')
              } else {
                  logger.info(`Success fetching sku levels`);
                  resolve({ sku, qty: stockLevel })
              }
          })
    });
  }
}

export default SKUService;