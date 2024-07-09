import AxiosInstance from "../axiosInstance";

const createLeave = async (employeeId, leave) => {
    try {
        const response = await AxiosInstance.post(`/employees/${employeeId}/leaves`, leave, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
};

// permisos asisganados a un empleado por filtro para aprobar o rechazar
const getLeavesByFilter = async (employeeId, filter) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/leaves/assigned?filter=${filter}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// historial de permisos de un empleado por filtro
const getleavesHistoryByFilter = async (employeeId, filter) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/leaves?filter=${filter}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// estadisticas de permisos de un empleado
const getLeaveStatistics = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/leave-statistics`);
        return response.data;
    } catch (error) {
        throw error;
    }
}



export {  createLeave, getLeavesByFilter, getleavesHistoryByFilter, getLeaveStatistics };


