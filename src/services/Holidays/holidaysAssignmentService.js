
import AxiosInstance from "../axiosInstance";

// Servicio para asignar un día festivo a un empleado
const assignHolidayToEmployee = async (id, data) => {
    try {
        const payload = {
            employee_ids: data, // Envolver el array en un objeto con la clave esperada
        };
        const response = await AxiosInstance.post(`/holiday-assignments/${id}`, payload);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {}, 
        };
    }
};

// Servicio para obtener todas las asignaciones de días festivos
const getAllHolidayAssignments = async () => {
    try {
        const response = await AxiosInstance.get("/holiday-assignments");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para obtener las asignaciones de días festivos de un empleado
const getHolidayAssignmentsByEmployee = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/holiday-assignments/employee/${employeeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para eliminar asignaciones de días festivos
const deleteHolidayAssignment = async (data) => {
    try {
        const response = await AxiosInstance.delete(`/holiday-assignments`, {
            data: {
                assignment_ids: data, // Preparar el payload según el backend
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
    assignHolidayToEmployee,
    getAllHolidayAssignments,
    getHolidayAssignmentsByEmployee,
    deleteHolidayAssignment,
};
