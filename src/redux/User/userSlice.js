import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsers,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
} from "../../services/User/UserService";

// Acción asíncrona para obtener los usuarios
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getUsers();
  return response.data;
});

// Acción asíncrona para actualizar un usuario
export const updateUserInStore = createAsyncThunk(
  "users/updateUserInStore",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const response = await updateUser(updatedUser, updatedUser.id);
      return response;
    } catch (error) {
      return rejectWithValue({ errors: error.response.data });
    }
  }
);

// Acción asíncrona para eliminar un usuario
export const deleteUserAction = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await deleteUser(userId);
    return response.data;
  }
);

// Acción asíncrona para habilitar un usuario
export const enableUserAction = createAsyncThunk(
  "users/enableUser",
  async (userId) => {
    const response = await enableUser(userId);
    return response.data;
  }
);

// Acción asíncrona para deshabilitar un usuario
export const disableUserAction = createAsyncThunk(
  "users/disableUser",
  async (userId) => {
    const response = await disableUser(userId);
    return response.data;
  }
);

// Creamos un slice de redux para los usuarios
const userSlice = createSlice({
  // Le damos un nombre al slice
  name: "users",
  // Definimos el estado inicial
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Otros reducers si los necesitas
  },
  extraReducers: (builder) => {
    builder
      // Cuando la acción fetchUsers está pendiente, cambiamos el estado a 'loading'

      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      // Cuando la acción fetchUsers se resuelve con éxito, cambiamos el estado a 'succeeded' y actualizamos los usuarios
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      // Cuando la acción fetchUsers se rechaza, cambiamos el estado a 'failed' y guardamos el error
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Cuando la acción updateUserInStore se resuelve con éxito, actualizamos el usuario correspondiente en el estado
      .addCase(updateUserInStore.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (updatedUser) {
          state.users = state.users.map((user) =>
            user ? (user.id === updatedUser.id ? updatedUser : user) : user
          );
        }
      })
      // Cuando la acción deleteUserAction se resuelve con éxito, eliminamos el usuario correspondiente del estado
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        const deletedUser = action.payload;
        if (deletedUser) {
          state.users = state.users.filter(
            (user) => user && user.id !== deletedUser.id
          );
        }
      })
      // Cuando la acción enableUserAction se resuelve con éxito, actualizamos el usuario correspondiente en el estado
      .addCase(enableUserAction.fulfilled, (state, action) => {
        const enabledUser = action.payload;
        if (enabledUser) {
          state.users = state.users.map((user) =>
            user ? (user.id === enabledUser.id ? enabledUser : user) : user
          );
        }
      })
      // Cuando la acción disableUserAction se resuelve con éxito, actualizamos el usuario correspondiente en el estado
      .addCase(disableUserAction.fulfilled, (state, action) => {
        const disabledUser = action.payload;
        if (disabledUser) {
          state.users = state.users.map((user) =>
            user ? (user.id === disabledUser.id ? disabledUser : user) : user
          );
        }
      });
  },
});

// Exportamos un selector para obtener los usuarios del estado
export const selectUsers = (state) => state.user?.users;

// Exportamos el reducer por defecto del slice
export default userSlice.reducer;
