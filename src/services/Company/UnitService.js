import AxiosInstance from "../axiosInstance";
const getUnits = async () => {
  try {
    const response = await AxiosInstance.get("/units");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllUnitsIncludingDeleted = async () => {
  try {
    const response = await AxiosInstance.get("/units-all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createUnit = async (newUnit) => {
  try {
    console.log(newUnit);
    const response = await AxiosInstance.post("/units", newUnit);
    return response.data;
  } catch (error) {
    // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const getUnit = async (id) => {
  try {
    const response = await AxiosInstance.get(`/units/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUnit = async (updatedData) => {
  try {
    const { id, data } = updatedData;
    const response = await AxiosInstance.put(`/units/${id}`, data);
    return response.data;
  } catch (error) {
    // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const deleteUnit = async (unit) => {
  try {
    const response = await AxiosInstance.delete(`/units/${unit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const toggleUnitStatus = async (id) => {
  try {
    const response = await AxiosInstance.post(`/units/toggle-status/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getUnits,
  getUnit,
  createUnit,
  deleteUnit,
  updateUnit,
  getAllUnitsIncludingDeleted,
  toggleUnitStatus,
};
