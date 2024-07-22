import AxiosInstance from "./axiosInstance";

const getConfigurations = async () => {
  try {
    const response = await AxiosInstance.get('/configurations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getConfiguration = async (id) => {
  try {
    const response = await AxiosInstance.get(`/configurations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createConfiguration = async (newConfiguration) => {
  try {
    const response = await AxiosInstance.post("/configurations", newConfiguration);
    return response.data;
  } catch (error) {
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const updateConfiguration = async (updateConfiguration) => {
  try {
    const { id, data } = updateConfiguration;
    const response = await AxiosInstance.put(`/configurations/${id}`, data);
    return response.data;
  } catch (error) {
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const deleteConfiguration = async (id) => { 
  try {
    const response = await AxiosInstance.delete(`/configurations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getConfigurations, getConfiguration, createConfiguration, updateConfiguration, deleteConfiguration };
