import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLanguages,
  createLanguage,
  getLanguage,
  updateLanguage as updateLanguageService,
  deleteLanguage,
} from "../../../services/Employee/Backgrounds/LanguageService";

// fetchLanguages es una acción asíncrona que obtiene todos los idiomas de un empleado
export const fetchLanguages = createAsyncThunk(
  "languages/fetchLanguages",
  async (employeeId) => {
    const response = await getLanguages(employeeId);
    return response.data;
  }
);

// fetchLanguage es una acción asíncrona que obtiene un idioma por su id
export const fetchLanguage = createAsyncThunk(
  "languages/fetchLanguage",
  async ({ employeeId, languageId }) => {
    const response = await getLanguage(employeeId, languageId);
    return response.data;
  }
);

// createNewLanguage es una acción asíncrona que crea un nuevo idioma
export const createNewLanguage = createAsyncThunk(
  "languages/createNewLanguage",
  async ({ employeeId, newLanguage }) => {
    const response = await createLanguage(employeeId, newLanguage);
    return response.data;
  }
);

// updateOneLanguage es una acción asíncrona que actualiza un idioma existente
export const updateOneLanguage = createAsyncThunk(
  "languages/updateOneLanguage",
  async ({ employeeId, updateLanguage }) => {
    const response = await updateLanguageService(employeeId, updateLanguage.id, updateLanguage);
    return response.data;
  }
);

// deleteOneLanguage es una acción asíncrona que elimina un idioma existente
export const deleteOneLanguage = createAsyncThunk(
  "languages/deleteOneLanguage",
  async ({ employeeId, languageId }) => {
    const response = await deleteLanguage(employeeId, languageId);
    return response.data;
  }
);

// languageSlice es un slice de Redux que maneja el estado de los idiomas en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los idiomas
export const languageSlice = createSlice({
  name: "languages",
  initialState: {
    languages: [],
    language: {},
    status: "idle",
    error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
            builder
                .addCase(fetchLanguages.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(fetchLanguages.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.languages = action.payload;
                })
                .addCase(fetchLanguages.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                })
                .addCase(fetchLanguage.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(fetchLanguage.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.language = action.payload;
                })
                .addCase(fetchLanguage.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                })
                .addCase(createNewLanguage.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(createNewLanguage.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.languages.push(action.payload);
                })
                .addCase(createNewLanguage.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = JSON.parse(action.error.message);
                })
                .addCase(updateOneLanguage.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(updateOneLanguage.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    const updatedLanguage = action.payload;
                    state.languages = state.languages.map((language) => {
                        if (language.id === updatedLanguage.id) {
                            return updatedLanguage;
                        }
                        return language;
                    });
                })
                .addCase(updateOneLanguage.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = JSON.parse(action.error.message);
                })
                .addCase(deleteOneLanguage.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(deleteOneLanguage.fulfilled, (state, action) => {
                    if (action.payload) {
                       state.languages = state.languages.filter(
                        (language) => language.id !== action.payload.id
                       );
                    }
                    state.status = "succeeded";
                })
                .addCase(deleteOneLanguage.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                });
        }
});

export default languageSlice.reducer;

