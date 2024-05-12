import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnits,
  updateUnit,
} from "../../services/Company/UnitService";

// fetchUnits es una acción asíncrona que obtiene todas las unidades
export const fetchUnits = createAsyncThunk("units/fetchUnits", async () => {
  const response = await getUnits();
  return response.data;
});

// fetchUnit es una acción asíncrona que obtiene una unidad por su id
export const fetchUnit = createAsyncThunk("units/fetchUnit", async (id) => {
  const response = await getUnit(id);
  return response.data;
});

// createNewUnit es una acción asíncrona que crea una nueva unidad
export const createNewUnit = createAsyncThunk(
  "units/createNewUnit",
  async (newUnit) => {
    const response = await createUnit(newUnit);
    return response.data;
  }
);

// updateOneUnit es una acción asíncrona que actualiza una unidad existente
export const updateOneUnit = createAsyncThunk(
  "units/updateOneUnit",
  async (updatedData) => {
    const response = await updateUnit(updatedData);
    return response;
  }
);

// deleteOneUnit es una acción asíncrona que elimina una unidad existente
export const deleteOneUnit = createAsyncThunk(
  "units/deleteOneUnit",
  async (unit) => {
    const response = await deleteUnit(unit);
    return response.data;
  }
);

// unitSlice es un slice de Redux que maneja el estado de las unidades en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las unidades
export const unitSlice = createSlice({
  name: "units",
  initialState: {
    units: [],
    unit: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unit = action.payload;
      })
      .addCase(fetchUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.units.push(action.payload);
      })
      .addCase(createNewUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(updateOneUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOneUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updateUnit = action.payload;
        state.units = state.units.map((unit) => {
          if (unit.id === updateUnit.id) {
            return updateUnit;
          }
          return unit;
        });
      })
      .addCase(updateOneUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(deleteOneUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneUnit.fulfilled, (state, action) => {
        if (action.payload) {
          state.units = state.units.filter(
            (unit) => unit.id !== action.payload.id
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOneUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default unitSlice.reducer;
