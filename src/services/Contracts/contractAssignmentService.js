import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los contratos de empleados
const  getAllContractAssignments = async () => {
    try {
        const response = await AxiosInstance.get("/contracts");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para crear un nuevo contrato de empleado
const  createContractAssignment = async (contractData) => {
    try {
        const response = await AxiosInstance.post("/contracts", contractData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        };
    }
};

// Servicio para obtener un contrato de empleado por ID
const getContractAssignmentById = async (id) => {
    try {
        const response = await AxiosInstance.get(`/contracts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para renovar un contrato de empleado por ID
const  renewContractAssignment = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/contracts/${id}/renew`);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        }
    }
};

// Servicio para terminar un contrato de empleado por ID
const terminateContractAssignment = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/contracts/${id}/terminate`);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {},
        }
    }
};

export {
    getAllContractAssignments,
    createContractAssignment,
    getContractAssignmentById,
    renewContractAssignment,
    terminateContractAssignment,
};


