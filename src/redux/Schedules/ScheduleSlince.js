import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllSchedules,
    createSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    restoreSchedule,
} from "../../services/Schedules/scheduleService";

// Acción asíncrona para obtener todos los horarios
export const fetchAllSchedules = createAsyncThunk(
    "schedules/fetchAllSchedules",
    async () => {
        const response = await getAllSchedules();
        return response.data;
    }
);

// Acción asíncrona para crear un nuevo horario
export const addNewSchedule = createAsyncThunk(
    "schedules/addNewSchedule",
    async (scheduleData) => {
        const response = await createSchedule(scheduleData);
        return response.data;
    }
);

// Acción asíncrona para obtener un horario por ID
export const fetchScheduleById = createAsyncThunk(
    "schedules/fetchScheduleById",
    async (id) => {
        const response = await getScheduleById(id);
        return response.data;
    }
);

// Acción asíncrona para actualizar un horario
export const updateExistingSchedule = createAsyncThunk(
    "schedules/updateExistingSchedule",
    async ({ id, scheduleData }) => {
        const response = await updateSchedule(id, scheduleData);
        return response.data;
    }
);

// Acción asíncrona para eliminar un horario
export const deleteExistingSchedule = createAsyncThunk(
    "schedules/deleteExistingSchedule",
    async (id) => {
        const response = await deleteSchedule(id);
        return response.data;
    }
);

// Acción asíncrona para restaurar un horario eliminado
export const restoreDeletedSchedule = createAsyncThunk(
    "schedules/restoreDeletedSchedule",
    async (id) => {
        const response = await restoreSchedule(id);
        return response.data;
    }
);

const schedulesSlice = createSlice({
    name: "schedules",
    initialState: {
        schedules: [],
        status: "idle", // idle, loading, succeeded, failed
        error: null,
        hasFetchedAll: false, // Para evitar múltiples peticiones
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Obtener todos los horarios
            .addCase(fetchAllSchedules.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllSchedules.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllSchedules.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Crear nuevo horario
            .addCase(addNewSchedule.fulfilled, (state, action) => {
                state.schedules.push(action.payload);
            })

            // Obtener horario por ID (opcional para mantener)
            .addCase(fetchScheduleById.fulfilled, (state, action) => {
                const existingIndex = state.schedules.findIndex(
                    (schedule) => schedule.id === action.payload.id
                );
                if (existingIndex >= 0) {
                    state.schedules[existingIndex] = action.payload;
                } else {
                    state.schedules.push(action.payload);
                }
            })

            // Actualizar horario
            .addCase(updateExistingSchedule.fulfilled, (state, action) => {
                const index = state.schedules.findIndex(
                    (schedule) => schedule.id === action.payload.id
                );
                if (index !== -1) {
                    state.schedules[index] = action.payload;
                }
            })

            // Eliminar horario
            .addCase(deleteExistingSchedule.fulfilled, (state, action) => {
                state.schedules = state.schedules.filter(
                    (schedule) => schedule.id !== action.payload.id
                );
            })

            // Restaurar horario
            .addCase(restoreDeletedSchedule.fulfilled, (state, action) => {
                state.schedules.push(action.payload);
            });
    },
});

export default schedulesSlice.reducer;
