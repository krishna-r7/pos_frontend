
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthServices from "@/services/AuthService";
import { handleResponse } from '@/config/index';
import { setSession } from "@/redux/action";


const useAuthSubmit = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

     const onSubmit = async (data: { email: string; password: string }) => {
        
        try {
            const res = await AuthServices.loginUser({ email: data.email, password: data.password });
            // console.log(res);
            dispatch(setSession(res?.user));
            // dispatch(loadingStart());
            
            if (res?.user?.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (res?.user?.role === "CASHIER") {
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


     return { 
        onSubmit
     };

}

export default useAuthSubmit;