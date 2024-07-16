import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPosition,
  deletePosition,
  getPosition,
  getPositions,
  updatePosition,
  getAllPositionsIncludingDeleted,
  togglePositionStatus
} from "../../services/Company/PositionService";
import { all } from "axios";

// fetchPositions es una acción asíncrona que obtiene todas las posiciones
export const fetchPositions = createAsyncThunk(
  "positions/fetchPositions",
  async () => {
    const response = await getPositions();
    return response.data;
  }
);

// fetchAllPositionsIncludingDeleted es una acción asíncrona que obtiene todas las posiciones, incluyendo las eliminadas
export const fetchAllPositionsIncludingDeleted = createAsyncThunk(
  "positions/fetchAllPositionsIncludingDeleted",
  async () => {
    const response = await getAllPositionsIncludingDeleted();
    return response.data;
  }
);

// fetchPosition es una acción asíncrona que obtiene una posición por su id
export const fetchPosition = createAsyncThunk(
  "positions/fetchPosition",
  async (id) => {
    const response = await getPosition(id);
    return response.data;
  }
);

// createNewPosition es una acción asíncrona que crea una nueva posición
export const createNewPosition = createAsyncThunk(
  "positions/createNewPosition",
  async (newPosition) => {
    const response = await createPosition(newPosition);
    return response.data;
  }
);

// updateOnePosition es una acción asíncrona que actualiza una posición existente
export const updateOnePosition = createAsyncThunk(
  "positions/updateOnePosition",
  async (updatedData) => {
    const response = await updatePosition(updatedData);
    return response;
  }
);

// deleteOnePosition es una acción asíncrona que elimina una posición existente
export const deleteOnePosition = createAsyncThunk(
  "positions/deleteOnePosition",
  async (position) => {
    const response = await deletePosition(position);
    return response.data;
  }
);

// toggleOnePositionStatus es una acción asíncrona que alterna el estado de activación de una posición
export const toggleOnePositionStatus = createAsyncThunk(
  "positions/toggleOnePositionStatus",
  async (id) => {
    const response = await togglePositionStatus(id);
    return response.data;
  }
);

// positionSlice es un slice de Redux que maneja el estado de las posiciones en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las posiciones
export const positionSlice = createSlice({
  name: "positions",
  initialState: {
    positions: [],
    allPositions: [],
    position: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.positions = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosition.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.position = action.payload;
      })
      .addCase(fetchPosition.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewPosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewPosition.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newPosition = action.payload;
        state.allPositions.push(newPosition);
        if (newPosition.status === 'Activo') {
          state.positions.push(newPosition);
        }
      })
      .addCase(createNewPosition.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(updateOnePosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOnePosition.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPosition = action.payload;
      
        // Actualizar en `positions`
        if (updatedPosition.status === 'Activo') {
          const index = state.positions.findIndex(position => position.id === updatedPosition.id);
          if (index !== -1) {
            state.positions[index] = updatedPosition;
          } else {
            state.positions.push(updatedPosition);
          }
        } else {
          state.positions = state.positions.filter(position => position.id !== updatedPosition.id);
        }
      
        // Actualizar en `allPositions`
        const allIndex = state.allPositions.findIndex(position => position.id === updatedPosition.id);
        if (allIndex !== -1) {
          state.allPositions[allIndex] = updatedPosition;
        }
      })
      .addCase(updateOnePosition.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(deleteOnePosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOnePosition.fulfilled, (state, action) => {
        if (action.payload) {
          state.positions = state.positions.filter(
            (position) => position.id !== action.payload.id
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOnePosition.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllPositionsIncludingDeleted.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPositionsIncludingDeleted.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPositions = action.payload;
      })
      .addCase(fetchAllPositionsIncludingDeleted.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleOnePositionStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOnePositionStatus.fulfilled, (state, action) => {
        const updatedPosition = action.payload;

        // Actualizar en `positions` (solo si está activo)
        const index = state.positions.findIndex(position => position.id === updatedPosition.id);
        if (index !== -1) {
          if (updatedPosition.status === 'Activo') {
            state.positions[index] = updatedPosition;
          } else {
            state.positions.splice(index, 1); // Eliminar si se desactiva
          }
        } else if (updatedPosition.status === 'Activo') {
          state.positions.push(updatedPosition); // Añadir si se activa
        }

        // Actualizar en `allPositions`
        const allIndex = state.allPositions.findIndex(position => position.id === updatedPosition.id);
        if (allIndex !== -1) {
          state.allPositions[allIndex] = updatedPosition;
        }

        state.status = "succeeded";
      })
      .addCase(toggleOnePositionStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
  },
});

export default positionSlice.reducer;
