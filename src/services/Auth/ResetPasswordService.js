import AxiosInstance from "../axiosInstance"

const ResetPasswordService = {
    changePassword: async (email) => {
      try {
        const response = await AxiosInstance.post("forgot-password", { email });
        return response.data; 
      } catch (error) {
        throw error; 
      }
    },
  };
  
  export default ResetPasswordService;