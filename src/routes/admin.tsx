import { lazy } from "react";
import Dashboard from "@/pages/admin/dashboard";
import Products from "@/pages/admin/items";
import AddOffer from "@/pages/admin/offer";
import Cashiers from "@/pages/admin/casheir";



const adminRoutes = [
  {
    path: "/dashboard",
    component:Dashboard,
  },
  {
    path: "/items",
    component:Products,
  },

  {
    path: "/offer",
    component:AddOffer,
  },
  {
    path: "/cashiers",
    component:Cashiers,
  }

 

];

export default adminRoutes;
