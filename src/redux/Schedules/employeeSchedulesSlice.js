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

// Acción asíncrona para asignar un horario a un empleado
export const assignSchedule = createAsyncThunk(
    "employeeSchedules/assignSchedule",
    async ({ employeeId, scheduleData }) => {
        const response = await assignScheduleToEmployee(employeeId, scheduleData);
        return response.data;
    }
);

// Acción asíncrona para cambiar un horario de un empleado
export const changeSchedule = createAsyncThunk(
    "employeeSchedules/changeSchedule",
    async ({ employeeId, scheduleData }) => {
        const response = await changeEmployeeSchedule(employeeId, scheduleData);
        return response.data;
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
        status: "idle", 
        error: null,
        hasFetchedAll: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Obtener todos los horarios de empleados
            .addCase(fetchAllEmployeeSchedules.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllEmployeeSchedules.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employeeSchedules = action.payload; 
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllEmployeeSchedules.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Obtener horarios activos de un empleado
            .addCase(fetchActiveSchedulesByEmployeeId.fulfilled, (state, action) => {
                state.activeEmployeeSchedules[action.meta.arg] = action.payload; 
            })

            // Asignar nuevo horario
            .addCase(assignSchedule.fulfilled, (state, action) => {
                state.employeeSchedules.push(action.payload); 
            })

            // Cambiar horario
            .addCase(changeSchedule.fulfilled, (state, action) => {
                const index = state.employeeSchedules.findIndex( 
                    (schedule) => schedule.id === action.payload.id
                );
                if (index !== -1) {
                    state.employeeSchedules[index] = action.payload; 
                }
            })

            // Eliminar horario
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.employeeSchedules = state.employeeSchedules.filter( 
                    (schedule) => schedule.id !== action.payload.id
                );
            })

            // Restaurar horario eliminado
            .addCase(restoreSchedule.fulfilled, (state, action) => {
                state.employeeSchedules.push(action.payload);
            });
    },
});

export default employeeSchedulesSlice.reducer;
