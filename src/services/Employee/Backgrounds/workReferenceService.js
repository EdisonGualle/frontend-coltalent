import AxiosInstance from "../../axiosInstance";

const getWorkReferences = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/work-references`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const createWorkReference = async (employeeId, newWorkReference) => {
    try {
        const response = await AxiosInstance.post(`/employees/${employeeId}/work-references`, newWorkReference);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

const getWorkReference = async (employeeId, workReferenceId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/work-references/${workReferenceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateWorkReference = async (employeeId, workReferenceId, updateWorkReference) => {
    try {
        const response = await AxiosInstance.put(`/employees/${employeeId}/work-references/${workReferenceId}`, updateWorkReference);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

const deleteWorkReference = async (employeeId, workReferenceId) => {
    try {
        const response = await AxiosInstance.delete(`/employees/${employeeId}/work-references/${workReferenceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export { getWorkReferences, createWorkReference, getWorkReference, updateWorkReference, deleteWorkReference };