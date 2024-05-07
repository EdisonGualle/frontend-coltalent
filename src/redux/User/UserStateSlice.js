import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserStates } from '../../services/User/UserStateService';

// Función asíncrona para obtener los estados de usuario
export const fetchUserStates = createAsyncThunk('userStates/fetchUserStates', async () => {
  const response = await getUserStates();
  return response.data;
});

// Slice para los estados de usuario
export const userStateSlice = createSlice({
  // Nombre del slice
  name: 'userStates',
  // Estado inicial
  initialState: {
    userStates: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  // Reducers para las acciones asíncronas
  extraReducers: (builder) => {
    builder
      // Acción para obtener los estados de usuario
      .addCase(fetchUserStates.pending, (state) => {
        state.status = 'loading';
      })
      // Acción completada
      .addCase(fetchUserStates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userStates = action.payload;
      })
      // Acción rechazada
      .addCase(fetchUserStates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Exportar acciones y el reducer
export default userStateSlice.reducer;