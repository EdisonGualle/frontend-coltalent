import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getConfigurations, updateConfiguration } from '../../services/configurationService';

// Acción asíncrona para obtener todas las configuraciones
export const fetchConfigurations = createAsyncThunk(
  'configurations/fetchConfigurations',
  async () => {
    const response = await getConfigurations();
    return response.data; // Devuelve los datos directamente
  }
);

// Acción asíncrona para actualizar una configuración
export const saveConfiguration = createAsyncThunk(
  'configurations/saveConfiguration',
  async ({ id, value }, { rejectWithValue }) => {
    try {
      await updateConfiguration({ id, data: { value } });
      return { id, value }; // Devuelve los datos actualizados
    } catch (error) {
      return rejectWithValue(error.response.data); // Manejo de errores
    }
  }
);

const configurationSlice = createSlice({
  name: 'configurations',
  initialState: {
    items: [], // Lista de configuraciones
    status: 'idle', // Estado de la solicitud
    error: null,
    hasFetched: false, // Indica si ya se cargaron las configuraciones
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener configuraciones
      .addCase(fetchConfigurations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Actualizar configuración
      .addCase(saveConfiguration.fulfilled, (state, action) => {
        const { id, value } = action.payload;
        const config = state.items.find((item) => item.id === id);
        if (config) {
          config.value = value; // Actualiza el valor
        }
      })
      .addCase(saveConfiguration.rejected, (state, action) => {
        state.error = action.payload; // Manejo de errores en actualización
      });
  },
});

export default configurationSlice.reducer;
