import requests from "./httpService";

const AuthServices = {
  loginUser: async (body:any) => {
    return requests.post('/user/login', body);
  },


}
export default AuthServices;
