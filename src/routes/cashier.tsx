import { lazy } from "react";
// use lazy for better code splitting
// 
// const Dashboard = lazy(() => import("@/pages/Cashier/Dashboard"));
import Dashboard from "@/pages/cashier/dashboard";

const cashierRoutes = [
  {
    path: "/dashboard",
    component:Dashboard,
  },
 

];

export default cashierRoutes;
