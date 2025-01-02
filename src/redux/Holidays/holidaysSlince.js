import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    restoreHoliday,
} from "../../services/Holidays/holidaysService";

// Acción asíncrona para obtener todos los días festivos
export const fetchAllHolidays = createAsyncThunk(
    "holidays/fetchAllHolidays",
    async () => {
        const response = await getAllHolidays();
        return response.data;
    }
);

// Acción asíncrona para obtener un día festivo por ID
export const fetchHolidayById = createAsyncThunk(
    "holidays/fetchHolidayById",
    async (id) => {
        const response = await getHolidayById(id);
        return response.data;
    }
);

// Acción asíncrona para crear un nuevo día festivo
export const createNewHoliday = createAsyncThunk(
    "holidays/createNewHoliday",
    async (holidayData, { rejectWithValue }) => {
        try {
            const response = await createHoliday(holidayData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para actualizar un día festivo existente
export const updateExistingHoliday = createAsyncThunk(
    "holidays/updateExistingHoliday",
    async ({ id, holidayData }, { rejectWithValue }) => {
        try {
            console.log('data redux', holidayData)
            const response = await updateHoliday(id, holidayData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para eliminar un día festivo
export const deleteExistingHoliday = createAsyncThunk(
    "holidays/deleteExistingHoliday",
    async (id) => {
        const response = await deleteHoliday(id);
        return response.data;
    }
);

// Acción asíncrona para restaurar un día festivo
export const restoreExistingHoliday = createAsyncThunk(
    "holidays/restoreExistingHoliday",
    async (id) => {
        const response = await restoreHoliday(id);
        return response.data;
    }
);

const holidaySlice = createSlice({
    name: "holidays",
    initialState: {
        holidays: [],
        holiday: {},
        fetchStatus: "idle", // Estado para obtener todos los días festivos
        createStatus: "idle", // Estado para crear un nuevo día festivo
        updateStatus: "idle", // Estado para actualizar un día festivo
        deleteStatus: "idle", // Estado para eliminar un día festivo
        restoreStatus: "idle", // Estado para restaurar un día festivo
        error: null, // Estado para manejar errores generales
        fieldErrors: {}, // Estado para manejar errores de validación
        hasFetchedAll: false, // Estado para saber si se han obtenido los días festivos
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.fieldErrors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Obtener todos los días festivos
            .addCase(fetchAllHolidays.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllHolidays.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.holidays = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllHolidays.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Crear un nuevo día festivo
            .addCase(createNewHoliday.pending, (state) => {
                state.createStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(createNewHoliday.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.holidays.push(action.payload);
            })
            .addCase(createNewHoliday.rejected, (state, action) => {
                state.createStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Actualizar un día festivo existente
            .addCase(updateExistingHoliday.pending, (state) => {
                state.updateStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(updateExistingHoliday.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const index = state.holidays.findIndex((holiday) => holiday.id === action.payload.id);
                if (index !== -1) {
                    state.holidays[index] = action.payload;
                }
            })
            .addCase(updateExistingHoliday.rejected, (state, action) => {
                state.updateStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Eliminar un día festivo
            .addCase(deleteExistingHoliday.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteExistingHoliday.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
                state.holidays = state.holidays.filter((holiday) => holiday.id !== action.payload.id);
            })
            .addCase(deleteExistingHoliday.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.error = action.error.message;
            })

    },
});

export const { clearErrors } = holidaySlice.actions;
export default holidaySlice.reducer;