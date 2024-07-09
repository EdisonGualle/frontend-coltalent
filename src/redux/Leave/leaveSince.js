import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    createLeave,
    getLeaveStatistics
} from "../../services/Leave/leaveService";

// createLeave es una acción asíncrona que crea un nuevo permiso
export const createOneLeave = createAsyncThunk(
    "leave/createLeave",
    async ({ employeeId, leave }) => {
        const response = await createLeave(employeeId, leave);
        return response.data;
    }
);

// Acción asíncrona para obtener estadísticas de permisos de un empleado
export const fetchLeaveStatistics = createAsyncThunk(
    "leave/getLeaveStatistics",
    async (employeeId) => {
        const response = await getLeaveStatistics(employeeId);
        return response.data;
    }
);


// leaveSlice es un slice de Redux que maneja el estado de los permisos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los permisos
const leaveSlice = createSlice({
    name: "leaves",
    initialState: {
        loading: false,
        error: null,
        statistics: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOneLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOneLeave.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createOneLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.parse(action.error.message);
            })
            .addCase(fetchLeaveStatistics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeaveStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchLeaveStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.parse(action.error.message);
            });
    }
});

export default leaveSlice.reducer;