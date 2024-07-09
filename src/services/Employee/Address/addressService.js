import AxiosInstance from "../../axiosInstance";

const getProvinces = async () => {
    try {
        const response = await AxiosInstance.get("/provinces");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCantons = async (provinceId) => {
    try {
        const response = await AxiosInstance.get(`/cantons/${provinceId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getParishes = async (cantonId) => {
    try {
        const response = await AxiosInstance.get(`/parishes/${cantonId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getProvinces, getCantons, getParishes };
