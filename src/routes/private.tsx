import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";

interface PrivateRouteProps {
  Component: ComponentType;
  roles?: string[];
}

const PrivateRoute = ({ Component, roles }: PrivateRouteProps) => {
    
  const user = useSelector(
    (state: RootState) => state.session?.userSession?.user
  );

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role; 

  if (roles && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default PrivateRoute;
