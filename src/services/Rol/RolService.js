import AxiosInstance from "../axiosInstance";

const getRoles = async () => {
  try {
    const response = await AxiosInstance.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error;
  }
};

const getRole = async (id) => {
  try {
    const response = await AxiosInstance.get(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    throw error;
  }
};

export {getRoles, getRole};