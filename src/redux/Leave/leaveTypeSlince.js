import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createLeaveType,
  deleteLeaveType,
  getLeaveType,
  getLeaveTypes,
  updateLeaveType as updateLeaveTypeService,
} from "../../services/Leave/leaveTypeService";

// fetchLeaveTypes es una acción asíncrona que obtiene todos los tipos de permisos
export const fetchLeaveTypes = createAsyncThunk(
  "leaveTypes/fetchLeaveTypes",
  async () => {
    const response = await getLeaveTypes();
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

// leaveTypeSlice es un slice de Redux que maneja el estado de los tipos de permisos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los tipos de permisos
export const leaveTypeSlice = createSlice({
  name: "leaveTypes",
  initialState: {
    leaveTypes: [],
    leaveType: {},
    status: "idle",
    error: null,
    hasFetchedOnce: false
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
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.hasFetchedOnce = false;
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
        state.leaveTypes.push(action.payload);
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
        state.leaveTypes = state.leaveTypes.map((leaveType) => {
          if (leaveType.id === updatedLeaveType.id) {
            return updatedLeaveType;
          }
          return leaveType;
        });
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
      });
  },
});

export default leaveTypeSlice.reducer;
