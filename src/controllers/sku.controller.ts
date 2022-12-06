import { SkuData } from '../interfaces/misc.interface';
import { NextFunction, Request, Response } from 'express';
import SKUService from '../services/sku.service';

class SKUController {
  public skuService = new SKUService();

  public getDetailsBySKU = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skuCode: string = req.query.skuCode as string;
      const skuData: SkuData  = await this.skuService.getSKULevels(skuCode);
      res.status(200).json({ data: skuData });
    } catch (error) {
      next(error);
    }
  };
}

export default SKUController;