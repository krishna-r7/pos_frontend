
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppServices from "@/services/AppService";
import { handleResponse } from '@/config/index';



const useAuthSubmit = () => {

   const addItemToBill = async (data: { cashierId: string; itemId: string; quantity: number }) => {
      try {
         const res = await AppServices.addItemToBill(data);
         return handleResponse(res);
      } catch (err) {
         return handleResponse(err);
      }
   };

   const createProduct = async (formData: FormData) => {
      try {
         console.log([...formData.entries()]);
         const res = await AppServices.createProduct(formData);
         console.log(res);

         return handleResponse(res);
      } catch (err) {
         return handleResponse(err);
      }
   };

   const createOffer = async (values: any) => {
      try {
         const payload = {
            name: values.name,
            type: values.type,
            priority: values.priority,
            isActive: values.isActive,


            validFrom: values.validity?.[0]?.toISOString(),
            validTo: values.validity?.[1]?.toISOString(),

            discountPercent:
               values.type === "PERCENTAGE"
                  ? values.discountPercent
                  : undefined,

            minQty:
               values.type === "QUANTITY"
                  ? values.minQty
                  : undefined,

            discountAmount:
               values.type === "QUANTITY"
                  ? values.discountAmount
                  : undefined,
         };

         // console.log(payload); 

         const res = await AppServices.createOffer(payload);
         return handleResponse(res);
      } catch (err) {
         return handleResponse(err);
      }
   };

   const createCashier = async (values: any) => {
      try {
         const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: "CASHIER",
         };

         const res = await AppServices.createCashier(payload);
         return handleResponse(res);
      } catch (err) {
         return handleResponse(err);
      }
   };

   return {
      addItemToBill,
      createProduct,
      createOffer,
      createCashier,
   };

}

export default useAuthSubmit;