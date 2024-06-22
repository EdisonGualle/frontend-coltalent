import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createTraining,
    deleteTraining,
    getTraining,
    getTrainings,
    updateTraining as updateTrainingService,
} from "../../../services/Employee/Education/trainingService";

// fetchTrainings es una acción asíncrona que obtiene todas las capacitaciones de un empleado
export const fetchTrainings = createAsyncThunk(
    "trainings/fetchTrainings",
    async (employeeId) => {
        const response = await getTrainings(employeeId);
        return response.data;
    }
);

// fetchTraining es una acción asíncrona que obtiene una capacitación por su id
export const fetchTraining = createAsyncThunk(
    "trainings/fetchTraining",
    async ({ employeeId, trainingId }) => {
        const response = await getTraining(employeeId, trainingId);
        return response.data;
    }
);

// createNewTraining es una acción asíncrona que crea una nueva capacitación
export const createNewTraining = createAsyncThunk(
    "trainings/createNewTraining",
    async ({ employeeId, newTraining }) => {
        const response = await createTraining(employeeId, newTraining);
        return response.data;
    }
);

// updateOneTraining es una acción asíncrona que actualiza una capacitación existente
export const updateOneTraining = createAsyncThunk(
    "trainings/updateOneTraining",
    async ({ employeeId, updateTraining }) => {
        const response = await updateTrainingService(employeeId, updateTraining.id, updateTraining);
        return response.data;
    }
);

// deleteOneTraining es una acción asíncrona que elimina una capacitación existente
export const deleteOneTraining = createAsyncThunk(
    "trainings/deleteOneTraining",
    async ({ employeeId, trainingId }) => {
        const response = await deleteTraining(employeeId, trainingId);
        return response.data;
    }
);

// trainingSlice es un slice de Redux que maneja el estado de las capacitaciones en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las capacitaciones
export const trainingSlice = createSlice({
    name: "trainings",
    initialState: {
        trainings: [],
        training: {},
        status: "idle",
        error: null,
    },
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrainings.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTrainings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.trainings = action.payload;
            })
            .addCase(fetchTrainings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchTraining.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTraining.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.training = action.payload;
            })
            .addCase(fetchTraining.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createNewTraining.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createNewTraining.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.trainings.push(action.payload);
            })
            .addCase(createNewTraining.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(updateOneTraining.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateOneTraining.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedTraining = action.payload;
                state.trainings = state.trainings.map((training) => {
                    if (training.id === updatedTraining.id) {
                        return updatedTraining;
                    }
                    return training;
                });
            })
            .addCase(updateOneTraining.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(deleteOneTraining.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteOneTraining.fulfilled, (state, action) => {
                if(action.payload) {
                    state.trainings = state.trainings.filter(
                        (training) => training.id !== action.payload.id
                    );
                }
                state.status = "succeeded";
            })
            .addCase(deleteOneTraining.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default trainingSlice.reducer;