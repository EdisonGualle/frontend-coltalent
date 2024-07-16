import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnits,
  updateUnit,
  getAllUnitsIncludingDeleted,
  toggleUnitStatus,
} from "../../services/Company/UnitService";

// fetchUnits es una acción asíncrona que obtiene todas las unidades
export const fetchUnits = createAsyncThunk("units/fetchUnits", async () => {
  const response = await getUnits();
  return response.data;
});

// fetchAllUnitsIncludingDeleted es una acción asíncrona que obtiene todas las unidades, incluyendo las eliminadas
export const fetchAllUnitsIncludingDeleted = createAsyncThunk(
  "units/fetchAllUnitsIncludingDeleted",
  async () => {
    const response = await getAllUnitsIncludingDeleted();
    return response.data;
  }
);

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

// toggleOneUnitStatus es una acción asíncrona que alterna el estado de activación de una unidad
export const toggleOneUnitStatus = createAsyncThunk(
  "units/toggleOneUnitStatus",
  async (id) => {
    const response = await toggleUnitStatus(id);
    return response;
  }
);

// unitSlice es un slice de Redux que maneja el estado de las unidades en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las unidades
export const unitSlice = createSlice({
  name: "units",
  initialState: {
    units: [],
    allUnits: [],
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
        const newUnit = action.payload;
        state.allUnits.push(newUnit);
        if (newUnit.status === "Activo") {
          state.units.push(newUnit);
        }
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
        const updatedUnit = action.payload;

        // Actualizar en `units`
        if (updatedUnit.status === "Activo") {
          const index = state.units.findIndex(
            (unit) => unit.id === updatedUnit.id
          );
          if (index !== -1) {
            state.units[index] = updatedUnit;
          } else {
            state.units.push(updatedUnit);
          }
        } else {
          state.units = state.units.filter(
            (unit) => unit.id !== updatedUnit.id
          );
        }

        // Actualizar en `allUnits`
        const allIndex = state.allUnits.findIndex(
          (unit) => unit.id === updatedUnit.id
        );
        if (allIndex !== -1) {
          state.allUnits[allIndex] = updatedUnit;
        }
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
      })
      .addCase(fetchAllUnitsIncludingDeleted.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUnitsIncludingDeleted.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUnits = action.payload;
      })
      .addCase(fetchAllUnitsIncludingDeleted.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleOneUnitStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleOneUnitStatus.fulfilled, (state, action) => {
        const updatedUnit = action.payload;

        // Actualizar en `units` (solo si está activo)
        const index = state.units.findIndex(
          (unit) => unit.id === updatedUnit.id
        );
        if (index !== -1) {
          if (updatedUnit.status === "Activo") {
            state.units[index] = updatedUnit;
          } else {
            state.units.splice(index, 1); // Eliminar si se desactiva
          }
        } else if (updatedUnit.status === "Activo") {
          state.units.push(updatedUnit); // Añadir si se activa
        }

        // Actualizar en `allUnits`
        const allIndex = state.allUnits.findIndex(
          (unit) => unit.id === updatedUnit.id
        );
        if (allIndex !== -1) {
          state.allUnits[allIndex] = updatedUnit;
        }

        state.status = "succeeded";
      })
      .addCase(toggleOneUnitStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export default unitSlice.reducer;
