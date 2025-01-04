import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    assignHolidayToEmployee,
    getAllHolidayAssignments,
    getHolidayAssignmentsByEmployee,
    deleteHolidayAssignment,
} from "../../services/Holidays/holidaysAssignmentService";

// Acción asíncrona para asignar un día festivo a un empleado
export const assignHoliday = createAsyncThunk(
    "holidays/assignHoliday",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await assignHolidayToEmployee(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para obtener todas las asignaciones de días festivos
export const fetchAllHolidayAssignments = createAsyncThunk(
    "holidays/fetchAllHolidayAssignments",
    async () => {
        const response = await getAllHolidayAssignments();
        return response.data;
    }
);

// Acción asíncrona para obtener las asignaciones de días festivos de un empleado
export const fetchHolidayAssignmentsByEmployee = createAsyncThunk(
    "holidays/fetchHolidayAssignmentsByEmployee",
    async (employeeId) => {
        const response = await getHolidayAssignmentsByEmployee(employeeId);
        return response.data;
    }
);

// Acción asíncrona para eliminar una asignación de día festivo
export const deleteHoliday = createAsyncThunk(
    "holidays/deleteHoliday",
    async ({data}, {rejectWithValue}) => {
        try {
            const response = await deleteHolidayAssignment(data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const assignHolidaySlice = createSlice({
    name: "assignHoliday",
    initialState: {
        holidayAssignments: [],
        fetchStatus: "idle", // Estado para obtener todas las asignaciones de días festivos
        assignStatus: "idle", // Estado para asignar un día festivo a un empleado
        deleteStatus: "idle", // Estado para eliminar una asignación de día festivo
        error: null, // Mensajes de error general
        fieldErrors: {}, // Mensajes de error de validación
        hasFetchedAll: false, // Indica si se han obtenido todas las asignaciones de días festivos
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.fieldErrors = {};
        },
    },
    extraReducers: (builder) => {
        builder

            // Obtener todas las asignaciones de días festivos
            .addCase(fetchAllHolidayAssignments.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllHolidayAssignments.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.holidayAssignments = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllHolidayAssignments.rejected, (state) => {
                state.fetchStatus = "failed";
                state.hasFetchedAll = false;
            })

            // Asignar un día festivo a un empleado
            .addCase(assignHoliday.pending, (state) => {
                state.assignStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(assignHoliday.fulfilled, (state, action) => {
                state.assignStatus = "succeeded";
                if (Array.isArray(action.payload.data)) {
                    action.payload.data.forEach((assignment) => {
                        state.holidayAssignments.push(assignment);
                    });
                }
            })
            .addCase(assignHoliday.rejected, (state, action) => {
                state.assignStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Eliminar asignaciones de días festivos
            .addCase(deleteHoliday.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteHoliday.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";

                // Obtener los IDs de asignaciones eliminadas del backend
                const deletedIds = action.payload.data.ids;

                // Filtrar los elementos que no están en los IDs eliminados
                state.holidayAssignments = state.holidayAssignments.filter(
                    (assignment) => !deletedIds.includes(assignment.id)
                );
            })
            .addCase(deleteHoliday.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.error = action.payload?.message || null;
            });
    }
});

export const { clearErrors } = assignHolidaySlice.actions;
export default assignHolidaySlice.reducer;
