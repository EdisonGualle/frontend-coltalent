import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getleavesHistoryByFilter } from "../../services/Leave/leaveService";

// Acción asíncrona para obtener el historial de permisos de un empleado
export const fetchLeaveHistory = createAsyncThunk(
    "leaveHistory/fetchLeaveHistory",
    async ({ employeeId, filter }) => {
        const response = await getleavesHistoryByFilter(employeeId, filter);
        return { data: response.data, filter };
    }
);

const leaveHistorySlice = createSlice({
    name: "leaveHistory",
    initialState: {
        loading: false,
        leaves: [],
        error: "",
        filter: "pendientes",
        cache: {}
    },
    reducers: {
        setLeaveHistoryFilter: (state, action) => {
            state.filter = action.payload;
            state.leaves = state.cache[action.payload] || [];
        },
        clearCache: (state) => {
            state.cache = {};
        },
        updateCache: (state, action) => {
            state.cache[action.payload.filter] = action.payload.data;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaveHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload.data;
                state.cache[action.payload.filter] = action.payload.data;
                state.error = "";
            })
            .addCase(fetchLeaveHistory.rejected, (state, action) => {
                state.loading = false;
                state.leaves = [];
                state.error = action.error.message;
            });
    }
});

export const { setLeaveHistoryFilter, clearCache, updateCache } = leaveHistorySlice.actions;

export default leaveHistorySlice.reducer;