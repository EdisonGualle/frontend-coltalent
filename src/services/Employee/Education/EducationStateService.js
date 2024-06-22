import AxiosInstance from "../../axiosInstance";

const getEducationStates = async () => {
  try {
    const response = await AxiosInstance.get("/education/states");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estados de educación:", error);
    throw error;
  }
}

const getEducationState = async (id) => {
  try {
    const response = await AxiosInstance.get(`/education/states/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado de educación:", error);
    throw error;
  }
}

export {getEducationState, getEducationStates};