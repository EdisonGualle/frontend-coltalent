import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los registros de trabajo en días festivos, descanso u horas extra
const getAllOvertimeWorks = async () => {
    try {
        const response = await AxiosInstance.get("/overtime-work");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para crear un nuevo registro de trabajo
const createOvertimeWork = async (overtimeWorkData) => {
    try {
        const response = await AxiosInstance.post("/overtime-work", overtimeWorkData);
        return response.data;
    } catch (error) {
        console.log('error service',error.response?.data);
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        };
    } 
};

// Servicio para obtener un registro específico de trabajo por ID
const getOvertimeWorkById = async (id) => {
    try {
        const response = await AxiosInstance.get(`/overtime-work/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para eliminar registros de trabajo en rango
const deleteOvertimeWorks = async (data) => {
    try {
        const response = await AxiosInstance.delete(`/overtime-work`, {
            data: {
                record_ids: data, // Preparar el payload según el backend
            },
        });
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        };
    }
};



export {
    getAllOvertimeWorks,
    createOvertimeWork,
    getOvertimeWorkById,
    deleteOvertimeWorks,
};
