import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";

interface PublicRouteProps {
    Component: ComponentType;
    roles?: string[];
}

const PublicRoute = ({ Component }: PublicRouteProps) => {
    const user = useSelector(
        (state: RootState) => state.session?.userSession?.user
    );

    const userRole = user?.role;

    if (user) {
        if (userRole === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (userRole === "CASHIER") {
            return <Navigate to="/cashier/dashboard" replace />;
        }  else {
            return <Navigate to="/" replace />;
        }
    }

    return <Component />;
};

export default PublicRoute;