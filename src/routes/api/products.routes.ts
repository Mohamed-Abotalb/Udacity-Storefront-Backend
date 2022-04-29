import express from 'express';
import controllers from '../../controllers/products.controllers';
import authorizationMiddleware from '../../middlewares/authenticate.middleware';

const productsRoutes = express.Router();

productsRoutes.route('/').get(controllers.getAllProducts)

productsRoutes.route('/create').post(authorizationMiddleware, controllers.createProduct);

productsRoutes.route('/:id')
    .get(controllers.getOneProduct)
    .patch(authorizationMiddleware, controllers.updateProduct)
    .delete(authorizationMiddleware, controllers.deleteOneProduct);

// productRoutes.route('/authenticate').post(controllers.authenticate);

export default productsRoutes;