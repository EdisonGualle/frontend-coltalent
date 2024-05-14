import { RiArrowDownCircleFill } from "react-icons/ri";
import AxiosInstance from "../axiosInstance";

const getPositions = async () => {
  try {
    const response = await AxiosInstance.get('/positions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createPosition = async (newPosition) => {
  try {
    const response = await AxiosInstance.post("/positions", newPosition);
    return response.data;
  } catch (error) {
    // Crear un objeto personalizado con u campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const getPosition = async (id) => {
  try {
    const response = await AxiosInstance.get(`/positions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePosition = async (updatePosition) => {
  try {
    const { id, data } = updatePosition;
    const response = await AxiosInstance.put(`/positions/${id}`, data);
    return response.data;
  } catch (error) {
    // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const deletePosition = async (position) => { 
  try {
    const response = await AxiosInstance.delete(`/positions/${position}`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getPositions, createPosition, getPosition, deletePosition, updatePosition };
