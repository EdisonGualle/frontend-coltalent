import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEducationLevel,
  getEducationLevels,
} from "../../../services/Employee/Education/EducationLevelService";

export const fetchEducationLevels = createAsyncThunk(
  "educationLevels/fetchEducationLevels",
  async () => {
    const response = await getEducationLevels();
    return response.data;
  }
);

export const fetchEducationLevel = createAsyncThunk(
  "educationLevels/fetchEducationLevel",
  async (id) => {
    const response = await getEducationLevel(id);
    return response.data;
  }
);

export const educationLevelSlice = createSlice({
  name: "educationLevels",
  initialState: {
    educationLevels: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationLevels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEducationLevels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educationLevels = action.payload;
      })
      .addCase(fetchEducationLevels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchEducationLevel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEducationLevel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educationLevels = action.payload;
      })
      .addCase(fetchEducationLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default educationLevelSlice.reducer;
