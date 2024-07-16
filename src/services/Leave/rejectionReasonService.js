import AxiosInstance from "../axiosInstance";

const getRejectionReasons = async () => {
    try {
        const response = await AxiosInstance.get("leaves/rejection-reasons");
        return response.data;
    } catch (error) {
        throw error;
    }
}; 

const getAllRejectionReasonsIncludingDeleted = async () => {
    try {
        const response = await AxiosInstance.get("leaves/rejection-reasons-all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createRejectionReason = async (newRejectionReason) => { 
    try {
        const response = await AxiosInstance.post("leaves/rejection-reasons", newRejectionReason);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const getRejectionReason = async (id) => {
    try {
        const response = await AxiosInstance.get(`leaves/rejection-reasons/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateRejectionReason = async ( rejectionReasonId, updateRejectionReason) => {
    try {
        const response = await AxiosInstance.put(`leaves/rejection-reasons/${rejectionReasonId}`, updateRejectionReason);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

const deleteRejectionReason = async (rejectionReasonId) => {
    try {
        const response = await AxiosInstance.delete(`leaves/rejection-reasons/${rejectionReasonId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const toggleRejectionReasonStatus = async (id) => {
    try {
        const response = await AxiosInstance.post(`leaves/rejection-reasons/toggle-status/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getRejectionReasons, createRejectionReason, getRejectionReason, updateRejectionReason, deleteRejectionReason, getAllRejectionReasonsIncludingDeleted, toggleRejectionReasonStatus };

