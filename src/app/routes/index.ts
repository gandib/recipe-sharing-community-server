import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { recipeRoutes } from '../modules/Recipe/Recipe.route';
import { paymentRoutes } from '../modules/Payment/payment.route';

const router = Router();
const modulesRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/recipe',
    route: recipeRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
