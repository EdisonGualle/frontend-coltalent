import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPublication,
  deletePublication,
  getPublication,
  getPublications,
  updatePublication as updatePublicationService,
} from "../../../services/Employee/Backgrounds/PublicationService";

// fetchPublications es una acción asíncrona que obtiene todas las publicaciones de un empleado
export const fetchPublications = createAsyncThunk(
  "publications/fetchPublications",
  async (employeeId) => {
    const response = await getPublications(employeeId);
    return response.data;
  }
);

// fetchPublication es una acción asíncrona que obtiene una publicación por su id
export const fetchPublication = createAsyncThunk(
  "publications/fetchPublication",
  async ({ employeeId, publicationId }) => {
    const response = await getPublication(employeeId, publicationId);
    return response.data;
  }
);

// createNewPublication es una acción asíncrona que crea una nueva publicación
export const createNewPublication = createAsyncThunk(
  "publications/createNewPublication",
  async ({ employeeId, newPublication }) => {
    const response = await createPublication(employeeId, newPublication);
    return response.data;
  }
);

// updateOnePublication es una acción asíncrona que actualiza una publicación existente
export const updateOnePublication = createAsyncThunk(
  "publications/updateOnePublication",
  async ({ employeeId, updatePublication }) => {
    const response = await updatePublicationService(employeeId, updatePublication.id, updatePublication);
    return response.data;
  }
);

// deleteOnePublication es una acción asíncrona que elimina una publicación existente
export const deleteOnePublication = createAsyncThunk(
  "publications/deleteOnePublication",
  async ({ employeeId, publicationId }) => {
    const response = await deletePublication(employeeId, publicationId);
    return response.data;
  }
);

// publicationSlice es un slice de Redux que maneja el estado de las publicaciones en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las publicaciones
export const publicationSlice = createSlice({
    name: "publications",
    initialState: {
        publications: [],
        publication: {},
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPublications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.publications = action.payload;
            })
            .addCase(fetchPublications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchPublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.publication = action.payload;
            })
            .addCase(fetchPublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createNewPublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createNewPublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.publications.push(action.payload);
            })
            .addCase(createNewPublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(updateOnePublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateOnePublication.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedPublication = action.payload;
                state.publications = state.publications.map((publication) => {
                    if (publication.id === updatedPublication.id) {
                        return updatedPublication;
                    }
                    return publication;
                });
            })
            .addCase(updateOnePublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(deleteOnePublication.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteOnePublication.fulfilled, (state, action) => {
                if(action.payload) {
                  state.publications = state.publications.filter(
                    (publication) => publication.id !== action.payload.id
                );
                }
                state.status = "succeeded";
            })
            .addCase(deleteOnePublication.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default publicationSlice.reducer;