
import AxiosInstance from "../axiosInstance";

const exportEmployees = async (params) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await AxiosInstance.get(`/export-employees?${query}`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { exportEmployees };
