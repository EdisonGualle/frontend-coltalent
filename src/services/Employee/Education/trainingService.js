import AxiosInstance from "../../axiosInstance";

const getTrainings = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/trainings`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createTraining = async (employeeId, newTraining) => {
    try {
        const response = await AxiosInstance.post(`/employees/${employeeId}/trainings`, newTraining);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

const getTraining = async (employeeId, trainingId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/trainings/${trainingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateTraining = async (employeeId, trainingId, updateTraining) => {
    try {
        const response = await AxiosInstance.put(`/employees/${employeeId}/trainings/${trainingId}`, updateTraining);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const deleteTraining = async (employeeId, trainingId) => {
    try {
        const response = await AxiosInstance.delete(`/employees/${employeeId}/trainings/${trainingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getTrainings, createTraining, getTraining, updateTraining, deleteTraining };