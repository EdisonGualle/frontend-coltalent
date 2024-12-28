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
    async (scheduleData, { rejectWithValue }) => {
        try {
            const response = await createSchedule(scheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
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
    async ({ id, scheduleData }, { rejectWithValue }) => {
        try {
            const response = await updateSchedule(id, scheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
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
        schedules: [], // Lista de horarios
        fetchStatus: "idle", // Estado para obtener horarios
        createStatus: "idle", // Estado para crear un horario
        updateStatus: "idle", // Estado para actualizar un horario
        deleteStatus: "idle", // Estado para eliminar un horario
        restoreStatus: "idle", // Estado para restaurar un horario
        error: null, // Errores generales
        fieldErrors: {}, // Errores de validación de campos
        hasFetchedAll: false, // Control para evitar múltiples peticiones
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null; 
            state.fieldErrors = {}; 
        },
    },
    extraReducers: (builder) => {
        builder
        
            // Obtener todos los horarios
            .addCase(fetchAllSchedules.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllSchedules.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.schedules = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllSchedules.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Crear nuevo horario
            .addCase(addNewSchedule.pending, (state) => {
                state.createStatus = "loading";
                state.error = null; // Limpiar errores generales previos
                state.fieldErrors = {}; // Limpiar errores de validación previos
            })
            .addCase(addNewSchedule.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.schedules.push(action.payload);
            })
            .addCase(addNewSchedule.rejected, (state, action) => {
                state.createStatus = "failed";
                const { message, errors } = action.error || {};
                state.error = message || null; 
                state.fieldErrors = errors || {};
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
            .addCase(updateExistingSchedule.pending, (state) => {
                state.updateStatus = "loading";
            })
            .addCase(updateExistingSchedule.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const index = state.schedules.findIndex(
                    (schedule) => schedule.id === action.payload.id
                );
                if (index !== -1) {
                    state.schedules[index] = action.payload;
                }
            })
            .addCase(updateExistingSchedule.rejected, (state, action) => {
                state.updateStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Eliminar horario
            .addCase(deleteExistingSchedule.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteExistingSchedule.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
            
                // Reemplazar el elemento en el estado con el objeto actualizado
                state.schedules = state.schedules.map((schedule) =>
                    schedule.id === action.payload.id ? action.payload : schedule
                );
            })
            .addCase(deleteExistingSchedule.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.error = action.error.message;
            })
            
            // Restaurar horario
            .addCase(restoreDeletedSchedule.pending, (state) => {
                state.restoreStatus = "loading";
            })
            .addCase(restoreDeletedSchedule.fulfilled, (state, action) => {
                state.restoreStatus = "succeeded";
            
                // Reemplazar el elemento en el estado con el objeto restaurado
                state.schedules = state.schedules.map((schedule) =>
                    schedule.id === action.payload.id ? action.payload : schedule
                );
            })
            .addCase(restoreDeletedSchedule.rejected, (state, action) => {
                state.restoreStatus = "failed";
                state.error = action.error.message;
            });
            
    },
});

export const { clearErrors } = schedulesSlice.actions;
export default schedulesSlice.reducer;
