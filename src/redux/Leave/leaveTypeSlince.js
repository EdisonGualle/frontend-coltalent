import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createLeaveType,
  deleteLeaveType,
  getLeaveType,
  getLeaveTypes,
  updateLeaveType as updateLeaveTypeService,
  getLeaveTypesIncludingDeleted,
  toggleLeaveTypeStatus,
} from "../../services/Leave/leaveTypeService";

// fetchLeaveTypes es una acción asíncrona que obtiene todos los tipos de permisos
export const fetchLeaveTypes = createAsyncThunk(
  "leaveTypes/fetchLeaveTypes",
  async () => {
    const response = await getLeaveTypes();
    return response.data;
  }
);

// fetchAllLeaveTypesIncludingDeleted es una acción asíncrona que obtiene todos los tipos de permisos, incluyendo los eliminados
export const fetchAllLeaveTypesIncludingDeleted = createAsyncThunk(
  "leaveTypes/fetchAllLeaveTypesIncludingDeleted",
  async () => {
    const response = await getLeaveTypesIncludingDeleted();
    return response.data;
  }
);

// fetchLeaveType es una acción asíncrona que obtiene un tipo de permiso por su id
export const fetchLeaveType = createAsyncThunk(
  "leaveTypes/fetchLeaveType",
  async (leaveTypeId) => {
    const response = await getLeaveType(leaveTypeId);
    return response.data;
  }
);

// createNewLeaveType es una acción asíncrona que crea un nuevo tipo de permiso
export const createNewLeaveType = createAsyncThunk(
  "leaveTypes/createNewLeaveType",
  async (newLeaveType) => {
    const response = await createLeaveType(newLeaveType);
    return response.data;
  }
);

// updateOneLeaveType es una acción asíncrona que actualiza un tipo de permiso existente
export const updateOneLeaveType = createAsyncThunk(
  "leaveTypes/updateOneLeaveType",
  async ({ leaveTypeId, updateLeaveType }) => {
    const response = await updateLeaveTypeService(leaveTypeId, updateLeaveType);
    return response.data;
  }
);

// deleteOneLeaveType es una acción asíncrona que elimina un tipo de permiso existente
export const deleteOneLeaveType = createAsyncThunk(
  "leaveTypes/deleteOneLeaveType",
  async (leaveTypeId) => {
    const response = await deleteLeaveType(leaveTypeId);
    return response.data;
  }
);

// toggleLeaveTypeStatus es una acción asíncrona que cambia el estado de un tipo de permiso
export const toggleOneLeaveTypeStatus = createAsyncThunk(
  "leaveTypes/toggleOneLeaveTypeStatus",
  async (id) => {
    const response = await toggleLeaveTypeStatus(id);
    return response.data;
  }
);

// leaveTypeSlice es un slice de Redux que maneja el estado de los tipos de permisos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los tipos de permisos
export const leaveTypeSlice = createSlice({
  name: "leaveTypes",
  initialState: {
    leaveTypes: [],
    allLeaveTypes: [],
    leaveType: {},
    status: "idle",
    error: null,
    hasFetchedOnce: false,
    hasFetchedAll: false, // Control para evitar múltiples peticiones
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaveTypes = action.payload;
        state.hasFetchedOnce = true;
        state.hasFetchedAll = true;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.hasFetchedOnce = false;
        state.hasFetchedAll = false;
      })
      .addCase(fetchLeaveType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeaveType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaveType = action.payload;
      })
      .addCase(fetchLeaveType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewLeaveType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewLeaveType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newLeaveType = action.payload;
        state.allLeaveTypes.push(newLeaveType);
        if (newLeaveType.status === "Activo") {
          state.leaveTypes.push(newLeaveType);
        }
      })
      .addCase(createNewLeaveType.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.stringify(action.error.message);
      })
      .addCase(updateOneLeaveType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOneLeaveType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedLeaveType = action.payload;

        // Actualizar en `leaveTypes`
        if (updatedLeaveType.status === "Activo") {
          const index = state.leaveTypes.findIndex(
            (leaveType) => leaveType.id === updatedLeaveType.id
          );
          if (index !== -1) {
            state.leaveTypes[index] = updatedLeaveType;
          } else {
            state.leaveTypes.push(updatedLeaveType);
          }
        } else {
          state.leaveTypes = state.leaveTypes.filter(
            (leaveType) => leaveType.id !== updatedLeaveType.id
          );
        }

        // Actualizar en `allLeaveTypes`
        const allIndex = state.allLeaveTypes.findIndex(
          (leaveType) => leaveType.id === updatedLeaveType.id
        );
        if (allIndex !== -1) {
          state.allLeaveTypes[allIndex] = updatedLeaveType;
        }
      })
      .addCase(updateOneLeaveType.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.stringify(action.error.message);
      })
      .addCase(deleteOneLeaveType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneLeaveType.fulfilled, (state, action) => {
        if (action.payload) {
          state.leaveTypes = state.leaveTypes.filter(
            (leaveType) => leaveType.id !== action.payload
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOneLeaveType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllLeaveTypesIncludingDeleted.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllLeaveTypesIncludingDeleted.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.allLeaveTypes = action.payload;
        }
      )
      .addCase(fetchAllLeaveTypesIncludingDeleted.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleOneLeaveTypeStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneLeaveTypeStatus.fulfilled, (state, action) => {
        const updatedLeaveType = action.payload;

        // Actualizar en `leaveTypes` (solo si está activo)
        const index = state.leaveTypes.findIndex(
          (leaveType) => leaveType.id === updatedLeaveType.id
        );
        if (index !== -1) {
          if (updatedLeaveType.status === "Activo") {
            state.leaveTypes[index] = updatedLeaveType;
          } else {
            state.leaveTypes.splice(index, 1); // Eliminar si se desactiva
          }
        } else if (updatedLeaveType.status === "Activo") {
          state.leaveTypes.push(updatedLeaveType); // Añadir si se activa
        }

        // Actualizar en `allLeaveTypes`
        const allIndex = state.allLeaveTypes.findIndex(
          (leaveType) => leaveType.id === updatedLeaveType.id
        );
        if (allIndex !== -1) {
          state.allLeaveTypes[allIndex] = updatedLeaveType;
        }

        state.status = "succeeded";
      })
      .addCase(toggleOneLeaveTypeStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default leaveTypeSlice.reducer;
