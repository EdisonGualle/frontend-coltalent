import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los horarios asignados a empleados
const getAllEmployeeSchedules = async () => {
    try {
        const response = await AxiosInstance.get("/employee-schedules");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para obtener los horarios activos de un empleado específico por ID
const getActiveSchedulesByEmployeeId = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employee-schedules/${employeeId}/active`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para asignar un nuevo horario a un empleado
const assignScheduleToEmployee = async (employeeId, scheduleData) => {
    try {
        const response = await AxiosInstance.post(`/employee-schedules/${employeeId}`, scheduleData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {}, 
        };
    }
};

// Servicio para cambiar un horario existente para un empleado
const changeEmployeeSchedule = async (employeeId, scheduleData) => {
    try {
        const response = await AxiosInstance.patch(`/employee-schedules/${employeeId}/change`, scheduleData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {}, 
        };
    }
};

// Servicio para eliminar un horario asignado a un empleado por ID
const deleteEmployeeSchedule = async (id) => {
    try {
        const response = await AxiosInstance.delete(`/employee-schedules/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para restaurar un horario eliminado por ID
const restoreEmployeeSchedule = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/employee-schedules/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllEmployeeSchedules,
    getActiveSchedulesByEmployeeId,
    assignScheduleToEmployee,
    changeEmployeeSchedule,
    deleteEmployeeSchedule,
    restoreEmployeeSchedule,
};
