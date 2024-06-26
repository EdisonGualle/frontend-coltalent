import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLeavesByFilter } from "../../services/Leave/leaveService";

export const fetchLeaves = createAsyncThunk(
    "leaves/fetchLeaves",
    async ({ employeeId, filter }, { getState }) => {
        const { cache } = getState().leaves;

        if (cache[filter]) {
            return { data: cache[filter], filter };
        }

        const response = await getLeavesByFilter(employeeId, filter);
        return { data: response.data, filter };
    }
);

const leavesSlice = createSlice({
    name: "leaves",
    initialState: {
        loading: false,
        leaves: [],
        error: "",
        filter: "todas",
        cache: {}
    },
    reducers: {
        setLeaveFilter: (state, action) => {
            state.filter = action.payload;
            state.leaves = state.cache[action.payload] || [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaves.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload.data;
                state.cache[action.payload.filter] = action.payload.data;
                state.error = "";
            })
            .addCase(fetchLeaves.rejected, (state, action) => {
                state.loading = false;
                state.leaves = [];
                state.error = action.error.message;
            });
    }
});

export const { setLeaveFilter } = leavesSlice.actions;

export default leavesSlice.reducer;
