import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { recipeRoutes } from '../modules/Recipe/Recipe.route';
import { paymentRoutes } from '../modules/Payment/payment.route';
import { groupRoutes } from '../modules/Group/Group.route';

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
    path: '/group',
    route: groupRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
