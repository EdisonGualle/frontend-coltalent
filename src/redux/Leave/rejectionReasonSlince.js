import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createRejectionReason,
  deleteRejectionReason,
  getRejectionReason,
  getRejectionReasons,
  updateRejectionReason as updateRejectionReasonService,
} from "../../services/Leave/rejectionReasonService";

// fetchRejectionReasons es una acción asíncrona que obtiene todas las razones de rechazo de solicitudes de permiso
export const fetchRejectionReasons = createAsyncThunk(
  "rejectionReasons/fetchRejectionReasons",
  async () => {
    const response = await getRejectionReasons();
    return response.data;
  }
);

// fetchRejectionReason es una acción asíncrona que obtiene una razón de rechazo por su id
export const fetchRejectionReason = createAsyncThunk(
  "rejectionReasons/fetchRejectionReason",
  async (rejectionReasonId) => {
    const response = await getRejectionReason(rejectionReasonId);
    return response.data;
  }
);

// createNewRejectionReason es una acción asíncrona que crea una nueva razón de rechazo
export const createNewRejectionReason = createAsyncThunk(
  "rejectionReasons/createNewRejectionReason",
  async (newRejectionReason) => {
    const response = await createRejectionReason(newRejectionReason);
    return response.data;
  }
);

// updateOneRejectionReason es una acción asíncrona que actualiza una razón de rechazo existente
export const updateOneRejectionReason = createAsyncThunk(
  "rejectionReasons/updateOneRejectionReason",
  async ({ rejectionReasonId, updateRejectionReason }) => {
    const response = await updateRejectionReasonService(
      rejectionReasonId,
      updateRejectionReason
    );
    return response.data;
  }
);

// deleteOneRejectionReason es una acción asíncrona que elimina una razón de rechazo existente
export const deleteOneRejectionReason = createAsyncThunk(
  "rejectionReasons/deleteOneRejectionReason",
  async (rejectionReasonId) => {
    const response = await deleteRejectionReason(rejectionReasonId);
    return response.data;
  }
);

// rejectionReasonSlice es un slice de Redux que maneja el estado de las razones de rechazo en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las razones de rechazo
export const rejectionReasonSlice = createSlice({
  name: "rejectionReasons",
  initialState: {
    rejectionReasons: [],
    rejectionReason: {},
    status: "idle",
    error: null,
    hasFetchedOnce: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchRejectionReasons.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchRejectionReasons.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.rejectionReasons = action.payload;
            state.hasFetchedOnce = true;
        })
        .addCase(fetchRejectionReasons.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.hasFetchedOnce = false;
        })
        .addCase(fetchRejectionReason.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchRejectionReason.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.rejectionReason = action.payload;
        })
        .addCase(fetchRejectionReason.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
        .addCase(createNewRejectionReason.pending, (state) => {
            state.status = "loading";
        })
        .addCase(createNewRejectionReason.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.rejectionReasons.push(action.payload);
        })
        .addCase(createNewRejectionReason.rejected, (state, action) => {
            state.status = "failed";
            state.error = JSON.parse(action.error.message);
        })
        .addCase(updateOneRejectionReason.pending, (state) => {
            state.status = "loading";
        })
        .addCase(updateOneRejectionReason.fulfilled, (state, action) => {
            state.status = "succeeded";
            const updatedRejectionReason = action.payload;
            state.rejectionReasons = state.rejectionReasons.map((rejectionReason) => {
                if (rejectionReason.id === updatedRejectionReason.id) {
                    return updatedRejectionReason;
                }
                return rejectionReason;
            });
        })
        .addCase(updateOneRejectionReason.rejected, (state, action) => {
            state.status = "failed";
            state.error = JSON.parse(action.error.message);
        })
        .addCase(deleteOneRejectionReason.pending, (state) => {
            state.status = "loading";
        })
        .addCase(deleteOneRejectionReason.fulfilled, (state, action) => {
            if(action.payload) {
                state.rejectionReasons = state.rejectionReasons.filter(
                    (rejectionReason) => rejectionReason.id !== action.payload
                );
            }
            state.status = "succeeded";
        })
        .addCase(deleteOneRejectionReason.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    }
});

export default rejectionReasonSlice.reducer;