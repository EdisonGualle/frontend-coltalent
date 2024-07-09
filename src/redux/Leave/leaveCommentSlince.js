import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    updateCommentAction
} from "../../services/Leave/leaveCommentService";

// updateComment es una acción asíncrona que actualiza un comentario existente
export const updateOneCommentAction = createAsyncThunk(
    "leaveComments/updateComment",
    async ({ employeeId, commentId, comment }) => {
        const response = await updateCommentAction(employeeId, commentId, comment);
        return response.data;
    }
);

// leaveCommentSlice es un slice de Redux que maneja el estado de los comentarios de permisos en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar los comentarios de permisos
const leaveCommentSlice = createSlice({
    name: "leaveComments",
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateOneCommentAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOneCommentAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateOneCommentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = JSON.parse(action.error.message);
            });
    }
});

export default leaveCommentSlice.reducer;