import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createWorkExperience,
    deleteWorkExperience,
    getWorkExperience,
    getWorkExperiences,
    updateWorkExperience as updateWorkExperienceService,
} from "../../../services/Employee/Backgrounds/workExperienceService";

// fetchWorkExperiences es una acción asíncrona que obtiene todas las experiencias laborales de un empleado
export const fetchWorkExperiences = createAsyncThunk(
    "workExperiences/fetchWorkExperiences",
    async (employeeId) => {
        const response = await getWorkExperiences(employeeId);
        return response.data;
    }
);

// fetchWorkExperience es una acción asíncrona que obtiene una experiencia laboral por su id
export const fetchWorkExperience = createAsyncThunk(
    "workExperiences/fetchWorkExperience",
    async ({ employeeId, workExperienceId }) => {
        const response = await getWorkExperience(employeeId, workExperienceId);
        return response.data;
    }
);

// createNewWorkExperience es una acción asíncrona que crea una nueva experiencia laboral
export const createNewWorkExperience = createAsyncThunk(
    "workExperiences/createNewWorkExperience",
    async ({ employeeId, newWorkExperience }) => {
        const response = await createWorkExperience(employeeId, newWorkExperience);
        return response.data;
    }
);

// updateOneWorkExperience es una acción asíncrona que actualiza una experiencia laboral existente
export const updateOneWorkExperience = createAsyncThunk(
    "workExperiences/updateOneWorkExperience",
    async ({ employeeId, updateWorkExperience }) => {
        console.log('redux',updateWorkExperience);
        const response = await updateWorkExperienceService(employeeId, updateWorkExperience.id, updateWorkExperience);
        return response.data;
    }
);

// deleteOneWorkExperience es una acción asíncrona que elimina una experiencia laboral existente
export const deleteOneWorkExperience = createAsyncThunk(
    "workExperiences/deleteOneWorkExperience",
    async ({ employeeId, workExperienceId }) => {
        const response = await deleteWorkExperience(employeeId, workExperienceId);
        return response.data;
    }
);

// workExperienceSlice es un slice de Redux que maneja el estado de las experiencias laborales en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las experiencias laborales
export const workExperienceSlice = createSlice({
    name: "workExperiences",
    initialState: {
        workExperiences: [],
        workExperience: {},
        status: "idle",
        error: null,
    },
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkExperiences.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWorkExperiences.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workExperiences = action.payload;
            })
            .addCase(fetchWorkExperiences.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchWorkExperience.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWorkExperience.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workExperience = action.payload;
            })
            .addCase(fetchWorkExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createNewWorkExperience.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createNewWorkExperience.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workExperiences.push(action.payload);
            })
            .addCase(createNewWorkExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(updateOneWorkExperience.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateOneWorkExperience.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedWorkExperience = action.payload;
                state.workExperiences = state.workExperiences.map((workExperience) => {
                    if (workExperience.id === updatedWorkExperience.id) {
                        return updatedWorkExperience;
                    }
                    return workExperience;
                });
            })
            .addCase(updateOneWorkExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(deleteOneWorkExperience.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteOneWorkExperience.fulfilled, (state, action) => {
                if(action.payload) {
                    state.status = "succeeded";
                    state.workExperiences = state.workExperiences.filter(
                        (workExperience) => workExperience.id !== action.payload.id
                    );
                }
                state.status = "succeeded";
            })
            .addCase(deleteOneWorkExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default workExperienceSlice.reducer;