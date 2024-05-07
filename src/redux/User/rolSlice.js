import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoles } from '../../services/User/RolService';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await getRoles();
  return response.data;
});

export const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default roleSlice.reducer;