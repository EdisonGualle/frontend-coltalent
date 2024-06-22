import AxiosInstance from "../../axiosInstance";

const getEducationLevels = async () => {
  try {
    const response = await AxiosInstance.get("/education/levels");
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getEducationLevel = async (id) => {
  try {
    const response = await AxiosInstance.get(`/education/levels/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export {getEducationLevels, getEducationLevel};