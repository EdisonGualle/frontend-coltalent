import AxiosInstance from "../axiosInstance";

const getUserStates = async () => {
    try {
        const response = await AxiosInstance.get(`/user/states`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el estado del usuario:", error);
        throw error;
    }
};

const getUserState = async (id) => {
    try {
      const response = await AxiosInstance.get(`user/states/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el estado de usuario:", error);
      throw error;
    }
  };


export {getUserStates, getUserState};