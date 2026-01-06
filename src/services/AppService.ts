import requests from "./httpService";

const AuthServices = {
  getItems: async (params = {}) => {
    // console.log(params);
     const query = new URLSearchParams(params).toString();
    return requests.get(`/item/active?${query}`);
  },

  getCurrentBill:async(cashierId:any) => {
    return requests.get(`/bill/current/${cashierId}`);
  },

  addItemToBill:async(body:any) => {
    return requests.post(`/bill/add`, body);
  },

  removeItemFromBill:async(body:any) => {
    return requests.post(`/bill/remove`, body);
  },

  updateBillItemQty:async(body:any) => {
    return requests.put(`/bill/update`, body);
  },
  generateBill:async(billId:string) => {
    return requests.put(`/bill/generate/${billId}`);
  },

  getBillHistory: async (params = {}) => {
    console.log(params);
     const query = new URLSearchParams(params).toString();
    return requests.get(`/bill/history?${query}`);
  },

  getAllItems: async (params = {}) => {
    // console.log(params);
     const query = new URLSearchParams(params).toString();
    return requests.get(`/item/all?${query}`);
  },

  createProduct:async(body:FormData) => {
    return requests.post(`/item/add`, body);
  },

  getActiveOffers: async () => {
    return requests.get(`/offer/active`);
  },

  getAllOffers: async (params = {}) => {
    // console.log(params);
    const query = new URLSearchParams(params).toString();
    return requests.get(`/offer/all?${query}`);
  },

  createOffer:async(body:any) => {
    return requests.post(`/offer/add`, body);
  },

  updateOfferStatus:async(id:string) => {
    return requests.put(`/offer/status/${id}`);
  },

  assignOffersToProduct:async(body:any) => {
    return requests.post(`/item/assignOffer`, body);
  },

  updateProduct:async(body:FormData,id:string) => {
    return requests.put(`/item/update/${id}`, body);
  },

  getAdminDashboard:async() => {
    return requests.get(`/user/dashboard`);
  },

  getAllCashier:async() => {
    return requests.get(`/user/cashiers`);
  },

  createCashier:async(body:any) => {
    return requests.post(`/user/create`, body);
  },



}
export default AuthServices;
