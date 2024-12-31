import AxiosInstance from "../axiosInstance";

// Servicio para obtener todos los tipos de contrato
const getAllContractTypes = async () => {
    try {
        const response = await AxiosInstance.get("/contract-types");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para crear un nuevo tipo de contrato
const createContractType = async (contractTypeData) => {
    try {
        const response = await AxiosInstance.post("/contract-types", contractTypeData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {}, 
        };
    }
};

// Servicio para obtener un tipo de contrato por ID
const getContractTypeById = async (id) => {
    try {
        const response = await AxiosInstance.get(`/contract-types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Servicio para actualizar un tipo de contrato por ID
const updateContractType = async (id, contractTypeData) => {
    try {
        const response = await AxiosInstance.put(`/contract-types/${id}`, contractTypeData);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.msg,
            errors: error.response?.data?.errors || {}, 
        };
    }
};

// Servicio para eliminar un tipo de contrato por ID
const deleteContractType = async (id) => {
    try {
        const response = await AxiosInstance.delete(`/contract-types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Servicio para restaurar un tipo de contrato eliminado por ID
const restoreContractType = async (id) => {
    try {
        const response = await AxiosInstance.patch(`/contract-types/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getAllContractTypes,
    createContractType,
    getContractTypeById,
    updateContractType,
    deleteContractType,
    restoreContractType,
};
