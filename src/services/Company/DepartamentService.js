import AxiosInstance from "../axiosInstance";
export const getDepartments = async () => {
  try {
    const response = await AxiosInstance.get('/departaments');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
    throw error;
  }
};