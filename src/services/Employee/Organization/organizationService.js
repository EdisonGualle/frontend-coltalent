import AxiosInstance from "../../axiosInstance";

const getDirections = async () => {
    try {
        const response = await AxiosInstance.get("/directions");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getUnitsAndPositions = async (directionId) => {
    try {
        const response = await AxiosInstance.get(`/directions/${directionId}/units-positions`);
        return response.data;
    } catch (error) {A
        throw error;
    }
};

const getPositions = async (unitId) => {
    try {
        const response = await AxiosInstance.get(`/units/${unitId}/positions`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getDirections, getUnitsAndPositions, getPositions };
