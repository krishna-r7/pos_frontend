import routes from "@/routes";
import { Suspense } from "react";
import Login from "@/pages/login";
import PublicRoute from "@/routes/public";
import PrivateRoute from "@/routes/private";
import { Routes, Route } from "react-router-dom";

// import Dashboard from "@/pages/Cashier/Dashboard";

function AppRoutes() {

  return (
    <>
      <Suspense fallback={
        <div className=" flex items-center justify-center h-screen">
         <p className="text-3xl font-bold underline">Loading...</p>
        </div>
      }>
        <Routes>
          {routes.map(({ path, component: Component, roles: roles }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute Component={Component} roles={roles} />}
            />
          ))}
          
          <Route path="/"  element={<PublicRoute Component={Login} />} />  

        </Routes>
      </Suspense>

    </>
  );
}

export default AppRoutes;
