import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFormalEducation,
  deleteFormalEducation,
  getFormalEducation,
  getFormalEducations,
  updateFormalEducation,
} from "../../../services/Employee/Education/FormalEducationService";

// fetchFormalEducations es una acción asíncrona que obtiene todas las educaciones formales de un empleado
export const fetchFormalEducations = createAsyncThunk(
  "formalEducations/fetchFormalEducations",
  async (employeeId) => {
    const response = await getFormalEducations(employeeId);
    return response.data;
  }
);

// fetchFormalEducation es una acción asíncrona que obtiene una educación formal por su id
export const fetchFormalEducation = createAsyncThunk(
  "formalEducations/fetchFormalEducation",
  async ({ employeeId, educationId }) => {
    const response = await getFormalEducation(employeeId, educationId);
    return response.data;
  }
);

// createNewFormalEducation es una acción asíncrona que crea una nueva educación formal
export const createNewFormalEducation = createAsyncThunk(
  "formalEducations/createNewFormalEducation",
  async ({ employeeId, newEducation }) => {
    const response = await createFormalEducation(employeeId, newEducation);
    return response.data;
  }
);

// updateOneFormalEducation es una acción asíncrona que actualiza una educación formal existente
export const updateOneFormalEducation = createAsyncThunk(
  "formalEducations/updateOneFormalEducation",
  async ({ employeeId, updateEducation }) => {
    // Directamente se pasa updateEducation como data, sin necesidad de reconstruirlo
    const response = await updateFormalEducation(employeeId, updateEducation.id, updateEducation);
    return response;
  }
);


  // deleteOneFormalEducation es una acción asíncrona que elimina una educación formal existente
  export const deleteOneFormalEducation = createAsyncThunk(
    "formalEducations/deleteOneFormalEducation",
    async ({ employeeId, educationId }) => {
      const response = await deleteFormalEducation(employeeId, educationId);
      return response.data;
    }
  );

// formalEducationSlice es un slice de Redux que maneja el estado de las educaciones formales en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las educaciones formales
export const formalEducationSlice = createSlice({
  name: "formalEducations",
  initialState: {
    formalEducations: [],
    formalEducation: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormalEducations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFormalEducations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formalEducations = action.payload;
      })
      .addCase(fetchFormalEducations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFormalEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFormalEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formalEducation = action.payload;
      })
      .addCase(fetchFormalEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewFormalEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewFormalEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formalEducations.push(action.payload);
      })
      .addCase(createNewFormalEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(updateOneFormalEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOneFormalEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedEducation = action.payload;
        state.formalEducations = state.formalEducations.map((education) => {
          if (education.id === updatedEducation.id) {
            return updatedEducation;
          }
          return education;
        });
      })
      .addCase(updateOneFormalEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = JSON.parse(action.error.message);
      })
      .addCase(deleteOneFormalEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOneFormalEducation.fulfilled, (state, action) => {
        if (action.payload) {
          state.formalEducations = state.formalEducations.filter(
            (education) => education.id !== action.payload.id
          );
        }
        state.status = "succeeded";
      })
      .addCase(deleteOneFormalEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default formalEducationSlice.reducer;
