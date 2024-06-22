import AxiosInstance from "../../axiosInstance";

const getWorkExperiences = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/work-experiences`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const createWorkExperience = async (employeeId, newWorkExperience) => {
    try {
        const response = await AxiosInstance.post(`/employees/${employeeId}/work-experiences`, newWorkExperience);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

const getWorkExperience = async (employeeId, workExperienceId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/work-experiences/${workExperienceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateWorkExperience = async (employeeId, workExperienceId, updateWorkExperience) => {
    try {
        const response = await AxiosInstance.put(`/employees/${employeeId}/work-experiences/${workExperienceId}`, updateWorkExperience);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

const deleteWorkExperience = async (employeeId, workExperienceId) => {
    try {
        const response = await AxiosInstance.delete(`/employees/${employeeId}/work-experiences/${workExperienceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export { getWorkExperiences, createWorkExperience, getWorkExperience, updateWorkExperience, deleteWorkExperience };