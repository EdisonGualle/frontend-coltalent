import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from "../../services/Company/DepartamentService";

// fetchDepartments es una acción asíncrona que obtiene todos los departamentos
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    const response = await getDepartments();
    return response.data;
  }
);

// fetchDepartment es una acción asíncrona que obtiene un departamento por su id
export const fetchDepartment = createAsyncThunk(
  "departments/fetchDepartment",
  async (id) => {
    const response = await getDepartment(id);
    return response.data;
  }
);

// createNewDepartment es una acción asíncrona que crea un nuevo departamento
export const createNewDepartment = createAsyncThunk(
  "departments/createNewDepartment",
  async (newDepartment) => {
    const response = await createDepartment(newDepartment);
    return response.data;
  }
);

// updateOneDepartment es una acción asíncrona que actualiza un departamento existente
export const updateOneDepartment = createAsyncThunk(
  "departments/updateOneDepartment",
  async (updatedData) => {
    const response = await updateDepartment(updatedData);
    return response;
  }
);

// deleteOneDepartment es una acción asíncrona que elimina un departamento existente
export const deleteOneDepartment = createAsyncThunk(
  "departments/deleteOneDepartment",
  async (department) => {
    const response = await deleteDepartment(department);
    return response.data;
  }
);

// departamentSlice es un slice de Redux que maneja el estado de los departamentos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los departamentos
export const departamentSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    department: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.department = action.payload;
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments.push(action.payload);
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(updateOneDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOneDepartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedDepartment = action.payload;
        state.departments = state.departments.map((department) => {
          if (department.id === updatedDepartment.id) {
            return updatedDepartment;
          }
          return department;
        });
      })
      .addCase(updateOneDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(deleteOneDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneDepartment.fulfilled, (state, action) => {
        if (action.payload) {
          state.departments = state.departments.filter(
            (department) => department.id !== action.payload.id
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOneDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default departamentSlice.reducer;
