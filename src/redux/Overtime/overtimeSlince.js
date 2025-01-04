import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllOvertimeWorks,
    createOvertimeWork,
    getOvertimeWorkById,
    deleteOvertimeWorks,
} from "../../services/Overtime/overtimeService";

// Acción asíncrona para obtener todos los registros de trabajo en días festivos, descanso u horas extra
export const fetchAllOvertimeWorks = createAsyncThunk(
    "overtime/fetchAllOvertimeWorks",
    async () => {
        const response = await getAllOvertimeWorks();
        return response.data;
    }
);

// Acción asíncrona para crear un nuevo registro de trabajo
export const createOvertime = createAsyncThunk(
    "overtime/createOvertime",
    async ({ overtimeData }, { rejectWithValue }) => {
        try {
            const response = await createOvertimeWork(overtimeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para obtener un registro específico de trabajo por ID
export const fetchOvertimeWorkById = createAsyncThunk(
    "overtime/fetchOvertimeWorkById",
    async (id) => {
        const response = await getOvertimeWorkById(id);
        return response.data;
    }
);

// Acción asíncrona para eliminar registros de trabajo en rango
export const deleteOvertime = createAsyncThunk(
    "overtime/deleteOvertime",
    async ({data}, {rejectWithValue}) => {
        try {
            const response = await deleteOvertimeWorks(data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const overtimeSlice = createSlice({
    name: "overtime",
    initialState: {
        overtimeWorks: [],
        fetchStatus: "idle", // Estado para obtener todos los registros de trabajo en días festivos, descanso u horas extra
        createStatus: "idle", // Estado para crear un nuevo registro de trabajo
        fetchByIdStatus: "idle", // Estado para obtener un registro específico de trabajo por ID
        deleteStatus: "idle", // Estado para eliminar registros de trabajo en rango
        error: null, // Mensajes de error general
        fieldErrors: {}, // Mensajes de error para campos específicos
        hasFetchedAll: false, // Bandera para saber si se han obtenido todos los registros
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.fieldErrors = {};
        }
    },
    extraReducers: (builder) => {
        builder

            // Obtener todos los registros de trabajo en días festivos, descanso u horas extra
            .addCase(fetchAllOvertimeWorks.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllOvertimeWorks.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.overtimeWorks = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllOvertimeWorks.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.hasFetchedAll = false;
            })

            .addCase(createOvertime.pending, (state) => {
                state.createStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(createOvertime.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.overtimeWorks.unshift(action.payload);
            })
            .addCase(createOvertime.rejected, (state, action) => {
                state.createStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Eliminar registros de trabajo en rango
            .addCase(deleteOvertime.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteOvertime.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";

                // Obtener los IDs de los registros eliminados del backend
                const deletedIds = action.payload.data.deleted_ids;

                // Filtrar los registros eliminados de la lista
                state.overtimeWorks = state.overtimeWorks.filter(
                    (work) => !deletedIds.includes(work.id)
                );
            })
            .addCase(deleteOvertime.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.error = action.payload?.message || null;
            });
    }
});

export const { clearErrors } = overtimeSlice.actions;
export default overtimeSlice.reducer;
