import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
  getAllDepartmentsIncludingDeleted,
  toggleDepartmentStatus
} from "../../services/Company/DepartamentService";

// fetchDepartments es una acción asíncrona que obtiene todos los departamentos
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    const response = await getDepartments();
    return response.data;
  }
);

export const fetchAllDepartmentsIncludingDeleted = createAsyncThunk(
  "departments/fetchAllDepartmentsIncludingDeleted",
  async () => {
    const response = await getAllDepartmentsIncludingDeleted();
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



export const toggleOneDepartmentStatus = createAsyncThunk(
  "departments/toggleOneDepartmentStatus",
  async (id) => {
    const response = await toggleDepartmentStatus(id);
    return response;
  }
);


// departamentSlice es un slice de Redux que maneja el estado de los departamentos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los departamentos
export const departamentSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    allDepartments: [],
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
        const newDepartment = action.payload;
        state.allDepartments.push(newDepartment);
        if (newDepartment.status === 'Activo') {
          state.departments.push(newDepartment);
        }
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
      
        // Actualizar en `departments`
        if (updatedDepartment.status === 'Activo') {
          const index = state.departments.findIndex(department => department.id === updatedDepartment.id);
          if (index !== -1) {
            state.departments[index] = updatedDepartment;
          } else {
            state.departments.push(updatedDepartment);
          }
        } else {
          state.departments = state.departments.filter(department => department.id !== updatedDepartment.id);
        }
      
        // Actualizar en `allDepartments`
        const allIndex = state.allDepartments.findIndex(department => department.id === updatedDepartment.id);
        if (allIndex !== -1) {
          state.allDepartments[allIndex] = updatedDepartment;
        }
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
      })
      .addCase(fetchAllDepartmentsIncludingDeleted.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllDepartmentsIncludingDeleted.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allDepartments = action.payload;
      })
      .addCase(fetchAllDepartmentsIncludingDeleted.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleOneDepartmentStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneDepartmentStatus.fulfilled, (state, action) => {
        const updatedDepartment = action.payload;

        // Actualizar en `departments` (solo si está activo)
        const index = state.departments.findIndex(department => department.id === updatedDepartment.id);
        if (index !== -1) {
          if (updatedDepartment.status === 'Activo') {
            state.departments[index] = updatedDepartment;
          } else {
            state.departments.splice(index, 1); // Eliminar si se desactiva
          }
        } else if (updatedDepartment.status === 'Activo') {
          state.departments.push(updatedDepartment); // Añadir si se activa
        }

        // Actualizar en `allDepartments`
        const allIndex = state.allDepartments.findIndex(department => department.id === updatedDepartment.id);
        if (allIndex !== -1) {
          state.allDepartments[allIndex] = updatedDepartment;
        }

        state.status = "succeeded";
      })
      .addCase(toggleOneDepartmentStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
  },
});

export default departamentSlice.reducer;
