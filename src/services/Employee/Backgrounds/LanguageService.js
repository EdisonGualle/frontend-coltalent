import AxiosInstance from "../../axiosInstance";

const getLanguages = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/languages`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createLanguage = async (employeeId, newLanguage) => {
    try {
        console.log(newLanguage)
        console.log(employeeId)
        const response = await AxiosInstance.post(`/employees/${employeeId}/languages`, newLanguage);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const getLanguage = async (employeeId, languageId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/languages/${languageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateLanguage = async (employeeId, languageId, updateLanguage) => {
    try {
        const response = await AxiosInstance.put(`/employees/${employeeId}/languages/${languageId}`, updateLanguage);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const deleteLanguage = async (employeeId, languageId) => {
    try {
        const response = await AxiosInstance.delete(`/employees/${employeeId}/languages/${languageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export { getLanguages, createLanguage, getLanguage, updateLanguage, deleteLanguage };

