import AxiosInstance from "../axiosInstance";

// Servicio para obtener el horario semanal de un empleado
const getEmployeeWeeklySchedule = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/weekly-schedule`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export { getEmployeeWeeklySchedule };
