import chai from 'chai';
import {getSKULevels, calculate} from './index';
import 'mocha';

describe('getSKULevels Test suite', () => {

    it('Check SKU level basic', async () => {
        return getSKULevels("LTV719449/39/39").then((response)=>{
            chai.expect(response).has.property('sku');
            chai.expect(response).has.property('qty');
            chai.expect(response).to.deep.equal({ sku: 'LTV719449/39/39', qty: 8510 })
        })
    });

    it('Check SKU level not in Stock and Transactions', () => {
        return getSKULevels("LTV719449X/39/39").catch((response)=>{
            chai.expect(response).to.be.an('string');
            chai.expect(response)
                .to
                .deep
                .equal('Error: SKU does not exist in the transactions.json and stock.json');
        })
    });
    
    it('Check SKU level not in Stock and Transactions- order at stocklevel 0', () => {
        return getSKULevels("REFUNDENTRY/68/09").catch((response)=>{
            chai.expect(response).to.be.an('string');
            chai.expect(response)
                .to
                .deep
                .equal('Cannot place order - stock level low');
        })
    });

    it('Check SKU level not in Stock but present in Transactions- refund at stocklevel 0', () => {
        return getSKULevels("NEWENTRY/68/09").then((response)=>{
            chai.expect(response).has.property('sku');
            chai.expect(response).has.property('qty');
            chai.expect(response).to.deep.equal({ sku: 'NEWENTRY/68/09', qty: 8 })
        })
    });

    it('Calculate function - to calculate refund txn', () => {
        const transaction = { sku: 'NEWENTRY/68/09', type: 'refund', qty: 8 };
        const initialStockLevel = 10;
        const reject = ()=> {};
        const result = calculate(transaction, initialStockLevel, reject);
        chai.expect(result).to.equal(18)
    });

    it('Calculate function - to calculate order txn', () => {
        const transaction = { sku: 'NEWENTRY/68/09', type: 'order', qty: 8 };
        const initialStockLevel = 10;
        const reject = ()=> {};
        const result = calculate(transaction, initialStockLevel, reject);
        chai.expect(result).to.equal(2)
    });
})