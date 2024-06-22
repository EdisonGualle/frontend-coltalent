import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getTrainingTypes,
    getTrainingType,
} from "../../../services/Employee/Education/trainingTypeService";

export const fetchTrainingTypes = createAsyncThunk(
    "trainingTypes/fetchTrainingTypes",
    async () => {
        const response = await getTrainingTypes();
        return response.data;
    }
);

export const fetchTrainingType = createAsyncThunk(
    "trainingTypes/fetchTrainingType",
    async (id) => {
        const response = await getTrainingType(id);
        return response.data;
    }
);

export const trainingTypeSlice = createSlice({
    name: "trainingTypes",
    initialState: {
        trainingTypes: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrainingTypes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTrainingTypes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.trainingTypes = action.payload;
            })
            .addCase(fetchTrainingTypes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchTrainingType.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTrainingType.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.trainingTypes = action.payload;
            })
            .addCase(fetchTrainingType.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default trainingTypeSlice.reducer;