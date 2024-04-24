import AxiosInstance from "../axiosInstance";
export const getPositions = async () => {
  try {
    const response = await AxiosInstance.get('/positions');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las posiciones:', error);
    throw error;
  }
};