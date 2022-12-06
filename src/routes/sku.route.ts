import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { GetSKUDetailsDto } from '../dtos/sku.dto';
import validationMiddleware from '../middleware/validation.middleware';
import SKUController from '../controllers/sku.controller';

class SKURoute implements Routes {
  public route = '/sku';
  public router = Router();
  public skuController = new SKUController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.route}?:skuCode`, validationMiddleware(GetSKUDetailsDto, 'query'),
     this.skuController.getDetailsBySKU);
  }
}

export default SKURoute;