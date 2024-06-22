import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getPublicationTypes,
    getPublicationType,
} from "../../../services/Employee/Backgrounds/PublicationTypeService";

export const fetchPublicationTypes = createAsyncThunk(
    "publicationTypes/fetchPublicationTypes",
    async () => {
        const response = await getPublicationTypes();
        return response.data;
    }
);

export const fetchPublicationType = createAsyncThunk(
    "publicationTypes/fetchPublicationType",
    async (id) => {
        const response = await getPublicationType(id);
        return response.data;
    }
);

export const publicationTypeSlice = createSlice({
    name: "publicationTypes",
    initialState: {
        publicationTypes: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicationTypes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPublicationTypes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.publicationTypes = action.payload;
            })
            .addCase(fetchPublicationTypes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchPublicationType.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPublicationType.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.publicationTypes = action.payload;
            })
            .addCase(fetchPublicationType.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default publicationTypeSlice.reducer;