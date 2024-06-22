import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEducationState,
  getEducationStates
} from "../../../services/Employee/Education/EducationStateService";

export const fetchEducationStates = createAsyncThunk(
  "educationStates/fetchEducationStates",
  async () => {
    const response = await getEducationStates();
    return response.data;
  }
);

export const fetchEducationState = createAsyncThunk(
  "educationStates/fetchEducationState",
  async (id) => {
    const response = await getEducationState(id);
    return response.data;
  }
);

export const educationStateSlice = createSlice({
  name: "educationStates",
  initialState: {
    educationStates: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEducationStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educationStates = action.payload;
      })
      .addCase(fetchEducationStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchEducationState.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEducationState.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educationStates = action.payload;
      })
      .addCase(fetchEducationState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default educationStateSlice.reducer;
