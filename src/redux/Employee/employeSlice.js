import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../../services/Employee/EmployeService1";

// fetchEmployees es una acción asíncrona que obtiene todos los empleados
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await getEmployees();
    return response.data;
  }
);

// fetchEmployee es una acción asíncrona que obtiene un empleado por su id
export const fetchEmployee = createAsyncThunk(
  "employees/fetchEmployee",
  async (id) => {
    const response = await getEmployee(id);
    return response.data;
  }
);

export const createNewEmployee = createAsyncThunk(
  "employees/createNewEmployee",
  async (newEmployee, { rejectWithValue }) => {
    try {
      const response = await createEmployee(newEmployee);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



// updateOneEmployee es una acción asíncrona que actualiza un empleado existente
export const updateOneEmployee = createAsyncThunk(
  "employees/updateOneEmployee",
  async ({ id, employee }, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(id, employee);  // Pasamos el id y el objeto employee
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



// deleteOneEmployee es una acción asíncrona que elimina un empleado existente
export const deleteOneEmployee = createAsyncThunk(
  "employees/deleteOneEmployee",
  async (employee) => {
    await deleteEmployee(employee);
    return employee.id; // Devuelve el ID del empleado eliminado
  }
);

// employeeSlice es un slice de Redux que maneja el estado de los empleados en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los empleados
export const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    employee: {},
    status: "idle",
    error: null,
  },
  reducers: {
    updateEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees.push(action.payload);
      })
      .addCase(createNewEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || action.payload;
      })
      .addCase(updateOneEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOneEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedEmployee = action.payload;
        state.employees = state.employees.map((employee) => {
          if (employee.id === updatedEmployee.id) {
            return updatedEmployee;
          }
          return employee;
        });
      })
      .addCase(updateOneEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || action.payload;
      })
      .addCase(deleteOneEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload
        );
        state.status = "succeeded";
      })
      .addCase(deleteOneEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});


export const { updateEmployees } = employeeSlice.actions;

//Exportamos un selector para obtener los empleados del estado
export const selectEmployees = (state) => state.employee?.employees;

export default employeeSlice.reducer;
