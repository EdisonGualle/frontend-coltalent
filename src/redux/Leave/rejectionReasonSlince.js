import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createRejectionReason,
  deleteRejectionReason,
  getRejectionReason,
  getRejectionReasons,
  updateRejectionReason as updateRejectionReasonService,
  getAllRejectionReasonsIncludingDeleted,
  toggleRejectionReasonStatus,
} from "../../services/Leave/rejectionReasonService";

// fetchRejectionReasons es una acción asíncrona que obtiene todas las razones de rechazo de solicitudes de permiso
export const fetchRejectionReasons = createAsyncThunk(
  "rejectionReasons/fetchRejectionReasons",
  async () => {
    const response = await getRejectionReasons();
    return response.data;
  }
);

// fetchAllRejectionReasonsIncludingDeleted es una acción asíncrona que obtiene todas las razones de rechazo de solicitudes de permiso, incluyendo las eliminadas
export const fetchAllRejectionReasonsIncludingDeleted = createAsyncThunk(
  "rejectionReasons/fetchAllRejectionReasonsIncludingDeleted",
  async () => {
    const response = await getAllRejectionReasonsIncludingDeleted();
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

// toggleOneRejectionReasonStatus es una acción asíncrona que alterna el estado de activación de una razón de rechazo
export const toggleOneRejectionReasonStatus = createAsyncThunk(
  "rejectionReasons/toggleOneRejectionReasonStatus",
  async (id) => {
    const response = await toggleRejectionReasonStatus(id);
    return response.data;
  }
);

// rejectionReasonSlice es un slice de Redux que maneja el estado de las razones de rechazo en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las razones de rechazo
export const rejectionReasonSlice = createSlice({
  name: "rejectionReasons",
  initialState: {
    rejectionReasons: [],
    allRejectionReasons: [],
    rejectionReason: {},
    status: "idle",
    fetchAllStatus: "idle", // Estado para obtener razones de rechazo incluyendo eliminadas
    error: null,
    hasFetchedOnce: false,
    hasFetchedAllIncludingDeleted: false, // Control para evitar múltiples peticione
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
        const newRejectionReason = action.payload;
        state.allRejectionReasons.push(newRejectionReason); // Agrega a la lista completa
        if (newRejectionReason.status === "Activo") {
          state.rejectionReasons.push(newRejectionReason); // Agrega a la lista activa si está activo
        }
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

        // Actualizar en `rejectionReasons`
        if (updatedRejectionReason.status === "Activo") {
          const index = state.rejectionReasons.findIndex(
            (rejectionReason) =>
              rejectionReason.id === updatedRejectionReason.id
          );
          if (index !== -1) {
            state.rejectionReasons[index] = updatedRejectionReason;
          } else {
            state.rejectionReasons.push(updatedRejectionReason);
          }
        } else {
          state.rejectionReasons = state.rejectionReasons.filter(
            (rejectionReason) =>
              rejectionReason.id !== updatedRejectionReason.id
          );
        }

        // Actualizar en `allRejectionReasons`
        const allIndex = state.allRejectionReasons.findIndex(
          (rejectionReason) => rejectionReason.id === updatedRejectionReason.id
        );
        if (allIndex !== -1) {
          state.allRejectionReasons[allIndex] = updatedRejectionReason;
        }
      })
      .addCase(updateOneRejectionReason.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(deleteOneRejectionReason.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneRejectionReason.fulfilled, (state, action) => {
        if (action.payload) {
          state.rejectionReasons = state.rejectionReasons.filter(
            (rejectionReason) => rejectionReason.id !== action.payload
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOneRejectionReason.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllRejectionReasonsIncludingDeleted.pending, (state) => {
        state.fetchAllStatus = "loading";
      })
      .addCase(
        fetchAllRejectionReasonsIncludingDeleted.fulfilled, (state, action) => {
          state.fetchAllStatus = "succeeded";
          state.allRejectionReasons = action.payload;
          state.hasFetchedAllIncludingDeleted = true;
      })
      .addCase(
        fetchAllRejectionReasonsIncludingDeleted.rejected,(state, action) => {
          state.fetchAllStatus = "failed";
          state.error = action.error.message;
          state.hasFetchedAllIncludingDeleted = false;
      })
      .addCase(toggleOneRejectionReasonStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneRejectionReasonStatus.fulfilled, (state, action) => {
        const updatedRejectionReason = action.payload;

        // Actualizar en `rejectionReasons` (solo si está activo)
        const index = state.rejectionReasons.findIndex(
          (rejectionReason) => rejectionReason.id === updatedRejectionReason.id
        );
        if (index !== -1) {
          if (updatedRejectionReason.status === "Activo") {
            state.rejectionReasons[index] = updatedRejectionReason;
          } else {
            state.rejectionReasons.splice(index, 1); // Eliminar si se desactiva
          }
        } else if (updatedRejectionReason.status === "Activo") {
          state.rejectionReasons.push(updatedRejectionReason); // Añadir si se activa
        }

        // Actualizar en `allRejectionReasons`
        const allIndex = state.allRejectionReasons.findIndex(
          (rejectionReason) => rejectionReason.id === updatedRejectionReason.id
        );
        if (allIndex !== -1) {
          state.allRejectionReasons[allIndex] = updatedRejectionReason;
        }

        state.status = "succeeded";
      })
      .addCase(toggleOneRejectionReasonStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default rejectionReasonSlice.reducer;
