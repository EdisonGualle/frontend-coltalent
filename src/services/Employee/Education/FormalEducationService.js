import AxiosInstance from "../../axiosInstance";

const getFormalEducations = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/employees/${employeeId}/formal-educations`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createFormalEducation = async (employeeId, newEducation) => {
  try {
    const response = await AxiosInstance.post(`/employees/${employeeId}/formal-educations`, newEducation);
    return response.data;
  } catch (error) {
    // Crear un objeto personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const getFormalEducation = async (employeeId, educationId) => {
  try {
    const response = await AxiosInstance.get(`/employees/${employeeId}/formal-educations/${educationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateFormalEducation = async (employeeId, educationId, updateEducation) => {
  try {
    const response = await AxiosInstance.put(`/employees/${employeeId}/formal-educations/${educationId}`, updateEducation);
    return response.data;
  } catch (error) {
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};


const deleteFormalEducation = async (employeeId, educationId) => {
  try {
    const response = await AxiosInstance.delete(`/employees/${employeeId}/formal-educations/${educationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getFormalEducations, createFormalEducation, getFormalEducation, updateFormalEducation, deleteFormalEducation };
