import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllEmployeeSchedules,
    getActiveSchedulesByEmployeeId,
    assignScheduleToEmployee,
    changeEmployeeSchedule,
    deleteEmployeeSchedule,
    restoreEmployeeSchedule,
} from "../../services/Schedules/employeeScheduleService";

// Acción asíncrona para obtener todos los horarios de empleados
export const fetchAllEmployeeSchedules = createAsyncThunk(
    "employeeSchedules/fetchAllEmployeeSchedules",
    async () => {
        const response = await getAllEmployeeSchedules();
        return response.data;
    }
);

// Acción asíncrona para obtener horarios activos de un empleado
export const fetchActiveSchedulesByEmployeeId = createAsyncThunk(
    "employeeSchedules/fetchActiveSchedulesByEmployeeId",
    async (employeeId) => {
        const response = await getActiveSchedulesByEmployeeId(employeeId);
        return response.data;
    }
);

// Acción asíncrona para asignar un nuevo horario a un empleado
export const assignSchedule = createAsyncThunk(
    "employeeSchedules/assignSchedule",
    async ({ employeeId, scheduleData }, { rejectWithValue }) => {
        try {
            const response = await assignScheduleToEmployee(employeeId, scheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para cambiar un horario de un empleado
export const changeSchedule = createAsyncThunk(
    "employeeSchedules/changeSchedule",
    async ({ employeeId, scheduleData }, { rejectWithValue }) => {
        try {
            const response = await changeEmployeeSchedule(employeeId, scheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


// Acción asíncrona para eliminar un horario
export const deleteSchedule = createAsyncThunk(
    "employeeSchedules/deleteSchedule",
    async (id) => {
        const response = await deleteEmployeeSchedule(id);
        return response.data;
    }
);

// Acción asíncrona para restaurar un horario eliminado
export const restoreSchedule = createAsyncThunk(
    "employeeSchedules/restoreSchedule",
    async (id) => {
        const response = await restoreEmployeeSchedule(id);
        return response.data;
    }
);

const employeeSchedulesSlice = createSlice({
    name: "employeeSchedules",
    initialState: {
        employeeSchedules: [],
        activeEmployeeSchedules: {},
        fetchStatus: "idle", // Estado para obtener todas las asignaciones
        activeFetchStatus: "idle", // Estado para obtener horarios activos
        assignStatus: "idle", // Estado para asignar un horario
        changeStatus: "idle", // Estado para cambiar un horario
        deleteStatus: "idle", // Estado para eliminar una asignación
        restoreStatus: "idle", // Estado para restaurar una asignación
        error: null, // Mensajes de error general
        fieldErrors: {}, // Errores específicos de campos      
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

            // Obtener todos los horarios de empleados
            .addCase(fetchAllEmployeeSchedules.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllEmployeeSchedules.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.employeeSchedules = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllEmployeeSchedules.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Asignar nuevo horario
            .addCase(assignSchedule.pending, (state) => {
                state.assignStatus = "loading";
                state.error = null; // Limpiar errores generales previos
                state.fieldErrors = {}; // Limpiar errores de validación previos
            })
            .addCase(assignSchedule.fulfilled, (state, action) => {
                state.assignStatus = "succeeded";

                // Extraer datos del payload
                const { updated_current_schedule, new_schedule } = action.payload;

                // Verificar si `updated_current_schedule` no es null
                if (updated_current_schedule) {
                    // Actualizar el horario actual
                    const currentIndex = state.employeeSchedules.findIndex(
                        (schedule) => schedule.id === updated_current_schedule.id
                    );
                    if (currentIndex !== -1) {
                        state.employeeSchedules[currentIndex] = updated_current_schedule;
                    }
                }


                // Agregar el nuevo horario
                state.employeeSchedules.unshift(new_schedule);
            })

            .addCase(assignSchedule.rejected, (state, action) => {
                state.assignStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Eliminar horario
            .addCase(deleteSchedule.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
                state.employeeSchedules = state.employeeSchedules.filter(
                    (schedule) => schedule.id !== action.payload.id
                );
            })
            .addCase(deleteSchedule.rejected, (state) => {
                state.deleteStatus = "failed";
            })

            // Restaurar horario eliminado
            .addCase(restoreSchedule.fulfilled, (state, action) => {
                state.employeeSchedules.push(action.payload);
            });
    },
});

export const { clearErrors } = employeeSchedulesSlice.actions;
export default employeeSchedulesSlice.reducer;
