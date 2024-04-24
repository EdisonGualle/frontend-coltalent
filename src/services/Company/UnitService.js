import AxiosInstance from "../axiosInstance";
export const getUnits = async () => {
  try {
    const response = await AxiosInstance.get('/units');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
    throw error;
  }
};