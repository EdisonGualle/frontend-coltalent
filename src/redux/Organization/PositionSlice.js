import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPosition,
  deletePosition,
  getPosition,
  getPositions,
  updatePosition,
} from "../../services/Company/PositionService";

// fetchPositions es una acción asíncrona que obtiene todas las posiciones
export const fetchPositions = createAsyncThunk(
  "positions/fetchPositions",
  async () => {
    const response = await getPositions();
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

// positionSlice es un slice de Redux que maneja el estado de las posiciones en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las posiciones
export const positionSlice = createSlice({
  name: "positions",
  initialState: {
    positions: [],
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
        state.positions.push(action.payload);
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
        state.positions = state.positions.map((position) => {
          if (position.id === updatedPosition.id) {
            return updatedPosition;
          }
          return position;
        });
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
      });
  },
});

export default positionSlice.reducer;
