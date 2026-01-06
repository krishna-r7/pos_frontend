import { lazy } from "react";
import Dashboard from "@/pages/cashier/dashboard";

const cashierRoutes = [
  {
    path: "/dashboard",
    component:Dashboard,
  },
  {
    path: "/history",
    component: lazy(() => import("@/pages/cashier/history")),
  },
 

];

export default cashierRoutes;
