import AxiosInstance from "../axiosInstance";

const getLeaveTypes = async () => {
  try {
    const response = await AxiosInstance.get("leaves/types");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLeaveTypesIncludingDeleted = async () => {
  try {
    const response = await AxiosInstance.get("leaves/types-all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createLeaveType = async (newLeaveType) => {
  try {
    const response = await AxiosInstance.post("leaves/types", newLeaveType);
    return response.data;
  } catch (error) {
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const getLeaveType = async (id) => {
  try {
    const response = await AxiosInstance.get(`leaves/types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLeaveType = async (leaveTypeId, updateLeaveType) => {
  try {
    const response = await AxiosInstance.put(
      `leaves/types/${leaveTypeId}`,
      updateLeaveType
    );
    return response.data;
  } catch (error) {
    const customError = new Error(JSON.stringify(error.response.data));
    throw customError;
  }
};

const deleteLeaveType = async (leaveTypeId) => {
  try {
    const response = await AxiosInstance.delete(`leaves/types/${leaveTypeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const toggleLeaveTypeStatus = async (id) => {
  try {
    const response = await AxiosInstance.post(`leaves/types/toggle-status/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getLeaveTypes,
  createLeaveType,
  getLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getLeaveTypesIncludingDeleted,
  toggleLeaveTypeStatus,
};
