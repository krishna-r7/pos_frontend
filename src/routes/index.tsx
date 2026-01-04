import cashierRoutes from "@/routes/cashier";


const CASHIER_PREFIX = "/cashier";

const routes = [
  ...cashierRoutes.map(route => ({
    ...route,
    path: `${CASHIER_PREFIX}${route.path}`,
    roles: ["CASHIER"],
  })),
  
  
];

export default routes;