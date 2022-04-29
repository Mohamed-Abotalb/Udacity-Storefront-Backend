import express from 'express';
import controllers from '../../controllers/users.controllers';
import authorizationMiddleware from '../../middlewares/authenticate.middleware';

const usersRoutes = express.Router();

// usersRoutes.get('/:id', controllers.getOneUser);
// usersRoutes.get('/', controllers.getAllUsers);
// usersRoutes.post('/', controllers.createUser);
// usersRoutes.patch('/:id', controllers.updateUser);
// usersRoutes.delete('/:id', controllers.deleteOneUser);

usersRoutes.route('/').get(authorizationMiddleware, controllers.getAllUsers);

usersRoutes.route('/create').post(controllers.createUser);

usersRoutes.route('/:id')
    .get(authorizationMiddleware, controllers.getOneUser)
    .patch(authorizationMiddleware, controllers.updateUser)
    .delete(authorizationMiddleware, controllers.deleteOneUser);

usersRoutes.route('/authenticate').post(controllers.authenticate);

export default usersRoutes;