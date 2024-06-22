import AxiosInstance from "../../axiosInstance";

const getTrainingTypes = async () => {
    try {
        const response = await AxiosInstance.get("/trainings/types");
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getTrainingType = async (id) => {
    try {
        const response = await AxiosInstance.get(`/trainings/types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {getTrainingTypes, getTrainingType};