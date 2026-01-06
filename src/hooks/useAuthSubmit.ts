
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthServices from "@/services/AuthService";
import { handleResponse } from '@/config/index';
import { setSession, clearSession } from "@/redux/action";
import { persistor } from "@/redux/store";
import { message } from "antd";


const useAuthSubmit = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

     const onSubmit = async (data: { email: string; password: string }) => {
        
        try {
            const res = await AuthServices.loginUser({ email: data.email, password: data.password });
            // console.log(res);
            dispatch(setSession(res?.data));
            // dispatch(loadingStart());
            
            if (res?.data?.user?.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (res?.data?.user?.role === "CASHIER") { 
                navigate("/cashier/dashboard");
            } 
        
            return res;
        } catch (err) {
            // console.error("Login error:", err?.response?.data?.message);
            // setError(err?.response?.data?.message || "Failed to submit form. Please try again.");
            return handleResponse(err); 
        } finally {
           
            // dispatch(loadingStop());
        }
    };

    const onLogout = async () => {
        dispatch(clearSession());
        await persistor.purge();
        navigate("/");
        message.success( "Logged out successfully.");
    };


     return { 
        onSubmit,
        onLogout
     };

}

export default useAuthSubmit;