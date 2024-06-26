import AxiosInstance from "../axiosInstance";


const getLeavesByFilter = async (employeeId, filter) => {
    try {
        const response = await AxiosInstance.get(`/employees/${employeeId}/leaves/assigned?filter=${filter}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getLeavesByFilter };


