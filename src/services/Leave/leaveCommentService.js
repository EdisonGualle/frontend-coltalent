import AxiosInstance from "../axiosInstance";


const updateCommentAction = async (employeeId, commentId, updateCommentAction) => {
    try {
        const response = await AxiosInstance.patch(`/employees/${employeeId}/comments/${commentId}`, updateCommentAction);
        return response.data;
    } catch (error) {
        const customError = new Error(JSON.stringify(error.response.data));
        throw customError;
    }
}

export { updateCommentAction };