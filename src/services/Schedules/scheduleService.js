import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los horarios
const getAllSchedules = async () => {
    try {
        const response = await AxiosInstance.get("/schedules");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para crear un nuevo horario
const createSchedule = async (scheduleData) => {
    try {
        const response = await AxiosInstance.post("/schedules", scheduleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para obtener un horario específico por ID
const getScheduleById = async (id) => {
    try {
        const response = await AxiosInstance.get(`/schedules/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para actualizar un horario específico por ID
const updateSchedule = async (id, scheduleData) => {
    try {
        const response = await AxiosInstance.put(`/schedules/${id}`, scheduleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para eliminar un horario específico por ID
const deleteSchedule = async (id) => {
    try {
        const response = await AxiosInstance.delete(`/schedules/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para restaurar un horario eliminado por ID
const restoreSchedule = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/schedules/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllSchedules, createSchedule, getScheduleById, updateSchedule, deleteSchedule, restoreSchedule,
};
