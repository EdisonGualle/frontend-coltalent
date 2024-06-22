import AxiosInstance from "../../axiosInstance";

const getPublications = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/publications`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createPublication = async (employeeId, newPublication) => {
    try {
        const response = await AxiosInstance.post(`/employees/${employeeId}/publications`, newPublication);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const getPublication = async (employeeId, publicationId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/publications/${publicationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updatePublication = async (employeeId, publicationId, updatePublication) => {
    try {
        const response = await AxiosInstance.put(`/employees/${employeeId}/publications/${publicationId}`, updatePublication);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const deletePublication = async (employeeId, publicationId) => {
    try {
        const response = await AxiosInstance.delete(`/employees/${employeeId}/publications/${publicationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getPublications, createPublication, getPublication, updatePublication, deletePublication };