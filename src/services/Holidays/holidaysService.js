import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los días festivos
const getAllHolidays = async () => {
    try {
        const response = await AxiosInstance.get("/holidays");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para crear un nuevo día festivo
const createHoliday = async (holidayData) => {
    try {
        const response = await AxiosInstance.post("/holidays", holidayData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        };
    }
};

// Servicio para obtener un día festivo por ID
const getHolidayById = async (id) => {
    try {
        const response = await AxiosInstance.get(`/holidays/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para actualizar un día festivo por ID
const updateHoliday = async (id, holidayData) => {
    try {
        console.log('data service', holidayData)
        const response = await AxiosInstance.put(`/holidays/${id}`, holidayData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        };
    }
};

// Servicio para eliminar un día festivo por ID
const deleteHoliday = async (id) => {
    try {
        const response = await AxiosInstance.delete(`/holidays/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para restaurar un día festivo por ID
const restoreHoliday = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/holidays/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllHolidays,
    createHoliday,
    getHolidayById,
    updateHoliday,
    deleteHoliday,
    restoreHoliday,
};
