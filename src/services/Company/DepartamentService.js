import AxiosInstance from "../axiosInstance";
const getDepartments = async () => {
  try {
    const response = await AxiosInstance.get('/directions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createDepartment = async (newDepartment) => {
  try {
    const response = await AxiosInstance.post('/directions', newDepartment);
    return response.data;
  } catch (error) {
   // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};


const getDepartment = async (id) => {
  try {
    const response = await AxiosInstance.get(`/directions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateDepartment = async (updatedData) => {
  try {
    const { id, data } = updatedData;
    const response = await AxiosInstance.put(`/directions/${id}`, data);
    return response.data;
  } catch (error) {
    // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const deleteDepartment = async (department) => {
  try {
    const response = await AxiosInstance.delete(`/directions/${department}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getDepartments, getDepartment, createDepartment, deleteDepartment, updateDepartment};



