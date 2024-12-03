import AxiosInstance from "../axiosInstance";


const getSubrogationCandidates = async (leaveId) => {
    try {
        const response = await AxiosInstance.get(`/leaves/${leaveId}/subrogation/candidates`);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

export { getSubrogationCandidates };