import express from 'express';
import controllers from '../../controllers/orders.controllers';
import authorizationMiddleware from '../../middlewares/authenticate.middleware';

const ordersRoutes = express.Router();

ordersRoutes.route('/').get(authorizationMiddleware, controllers.getAllOrders);

ordersRoutes.route('/create').post(authorizationMiddleware, controllers.createOrder);

ordersRoutes.route('/:id/products').post(authorizationMiddleware, controllers.addProduct);

ordersRoutes.route('/:id')
    .get(authorizationMiddleware, controllers.getOneOrder)
    .patch(authorizationMiddleware, controllers.updateOneOrder)
    .delete(authorizationMiddleware, controllers.deleteOneOrder);

export default ordersRoutes;
