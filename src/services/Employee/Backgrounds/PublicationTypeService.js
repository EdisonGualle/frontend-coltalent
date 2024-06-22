import AxiosInstance from "../../axiosInstance";

const getPublicationTypes = async () => {
    try {
        const response = await AxiosInstance.get("/publications/types");
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getPublicationType = async (id) => {
    try {
        const response = await AxiosInstance.get(`/publications/types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {getPublicationTypes, getPublicationType};