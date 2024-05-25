import AxiosInstance from "../axiosInstance";

const getEmployees = async () => {
    try {
      const response = await AxiosInstance.get('/employees');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createEmployee = async (newEmployee) => {
    try {
      const response = await AxiosInstance.post("/employees", newEmployee);
      return response.data;
    } catch (error) {
      // Crear un objeto personalizado con u campo de mensaje que sea una cadena JSON del objeto de error
      const customError = new Error(JSON.stringify(error.response.data));
      throw customError;
    }
  };

 const getEmployee = async (employee) => {
    try {
      const response = await AxiosInstance.get(`/employees/${employee}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const updateEmployee = async (updateEmployee) => {
    try {
      const { id, data } = updateEmployee;
      const response = await AxiosInstance.put(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      // Crear un objeto de error personalizado con un campo de mensaje que sea una cadena JSON del objeto de error
      const customError = new Error(JSON.stringify(error.response.data));
      throw customError;
    }
  };

  const deleteEmployee = async (employee) => {
    try {
      const response = await AxiosInstance.delete(`/employees/${employee}`)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

export { getEmployees, getEmployee, createEmployee, deleteEmployee, updateEmployee};
