
import { Suspense } from "react";
import routes from "@/routes";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login";
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
              element={<Component />}

              // element={<PrivateRoute Component={Component} roles={roles} />}
            />
          ))}
          
          <Route path="/"  element={<Login />} />  

        </Routes>
      </Suspense>

    </>
  );
}

export default AppRoutes;
