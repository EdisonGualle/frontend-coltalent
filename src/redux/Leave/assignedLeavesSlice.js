import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeavesByFilter } from "../../services/Leave/leaveService";

// Acción asíncrona para obtener las solicitudes de permisos asignadas a un empleado
export const fetchAssignedLeaves = createAsyncThunk(
    "assignedLeaves/fetchAssignedLeaves",
    async ({ employeeId, filter }) => {
        const response = await getLeavesByFilter(employeeId, filter);
        console.log("fetchAssignedLeaves since", response.data);
        return { data: response.data, filter };
    }
);

const assignedLeavesSlice = createSlice({
    name: "assignedLeaves",
    initialState: {
        loading: false,
        leaves: [],
        error: "",
        filter: "pendientes",
        cache: {}
    },
    reducers: {
        setAssignedLeaveFilter: (state, action) => {
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
            .addCase(fetchAssignedLeaves.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAssignedLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload.data;
                state.cache[action.payload.filter] = action.payload.data;
                state.error = "";
            })
            .addCase(fetchAssignedLeaves.rejected, (state, action) => {
                state.loading = false;
                state.leaves = [];
                state.error = action.error.message;
            });
    }
});

export const { setAssignedLeaveFilter, clearCache, updateCache } = assignedLeavesSlice.actions;

export default assignedLeavesSlice.reducer;
