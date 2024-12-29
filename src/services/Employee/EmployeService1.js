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
    throw error.response ? error.response.data : error.message;
  }
};

// Servicio para obtener empleados con contratos activos
const getActiveEmployees = async () => {
  try {
    const response = await AxiosInstance.get("/employees/contracts/active");
    return response.data;
  } catch (error) {
    throw error;
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

const updateEmployee = async (id, submissionData) => {
  try {
    const response = await AxiosInstance.put(`/employees/${id}`, submissionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
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

export { getEmployees, getEmployee, createEmployee, deleteEmployee, updateEmployee, getActiveEmployees };
