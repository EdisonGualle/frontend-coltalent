import AxiosInstance from "../axiosInstance";

// Servicio para obtener el calendario de un empleado
const getEmployeeCalendar = async (employeeId) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/calendar`);
        if (response.data.status) {
            return response.data.data; 
        } else {
            throw new Error(response.data.msg || "Error desconocido al obtener el calendario.");
        }
    } catch (error) {
        throw new Error("Hubo un problema al comunicarse con el servidor. Por favor, intenta nuevamente.");
    }
};

export { getEmployeeCalendar };