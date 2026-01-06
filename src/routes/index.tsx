import cashierRoutes from "@/routes/cashier";
import adminRoutes from "@/routes/admin";



const CASHIER_PREFIX = "/cashier";
const ADMIN_PREFIX = "/admin";

const routes = [
  ...cashierRoutes.map(route => ({
    ...route,
    path: `${CASHIER_PREFIX}${route.path}`,
    roles: ["CASHIER"],
  })),
  
  ...adminRoutes.map(route => ({
    ...route,
    path: `${ADMIN_PREFIX}${route.path}`,
    roles: ["ADMIN"],
  })),
];

export default routes;