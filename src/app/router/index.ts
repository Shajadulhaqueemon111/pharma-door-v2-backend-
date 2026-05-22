import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AdminRoute } from '../modules/admin/admin.route';
import { PhermasistRoute } from '../modules/phermasist/phermasist.route';
import { LoginRouetr } from '../modules/auth/auth.route';
import { ProductRouter } from '../modules/student/student.route';
import { notificationRouter } from '../modules/notification/notification.route';
import { MedicineRoute } from '../modules/Allmedicine/medicine.route';
import { orderRoutes } from '../modules/Order/order.route';
import { paymentRoutes } from '../modules/payments/payment.router';
import { EquipmentRoute } from '../modules/equipments/equipment.route';
import { OfferRoute } from '../modules/specialoffer/offer.route';
import { BlogRoute } from '../modules/blogsection/blog.route';
import { AnimalMedicineRoute } from '../modules/animalmedicine/animalmed.route';

const router = Router();

const modulesRouter = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoute,
  },
  {
    path: '/phermacist',
    route: PhermasistRoute,
  },
  {
    path: '/auth',
    route: LoginRouetr,
  },
  {
    path: '/product',
    route: ProductRouter,
  },
  {
    path: '/notification',
    route: notificationRouter,
  },
  {
    path: '/medicine',
    route: MedicineRoute,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/equipment',
    route: EquipmentRoute,
  },
  {
    path: '/offer',
    route: OfferRoute,
  },
  {
    path: '/blog',
    route: BlogRoute,
  },
  {
    path: '/animal-medicine',
    route: AnimalMedicineRoute,
  },
];

modulesRouter.forEach((route) => router.use(route.path, route.route));

export default router;
