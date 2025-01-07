import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getEmployeeWeeklySchedule
} from "../../services/Calendar/weeklyScheduleService";

// Acción asíncrona para obtener el horario semanal de un empleado
export const fetchEmployeeSchedule = createAsyncThunk(
    "weeklySchedule/fetchEmployeeSchedule",
    async (employeeId) => {
        const response = await getEmployeeWeeklySchedule(employeeId);
        return response;
    }
);

const weeklyScheduleSlice = createSlice({
    name: "weeklySchedule",
    initialState: {
        weeklySchedule: [],
        fetchStatus: "idle" ,
        hasFetchedAll: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeSchedule.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchEmployeeSchedule.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.weeklySchedule = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchEmployeeSchedule.rejected, (state) => {
                state.fetchStatus = "failed";
                state.hasFetchedAll = false;
            });
    }   
});

export default weeklyScheduleSlice.reducer;