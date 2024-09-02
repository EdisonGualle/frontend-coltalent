import AxiosInstance from "../../axiosInstance";

const getEmployeeWorkSchedules = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/employees/${employeeId}/work-schedules`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getEmployeeWorkSchedules };
