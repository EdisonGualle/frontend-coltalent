import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createWorkReference,
    deleteWorkReference,
    getWorkReference,
    getWorkReferences,
    updateWorkReference as updateWorkReferenceService,
} from "../../../services/Employee/Backgrounds/workReferenceService";

// fetchWorkReferences es una acción asíncrona que obtiene todas las referencias laborales de un empleado
export const fetchWorkReferences = createAsyncThunk(
    "workReferences/fetchWorkReferences",
    async (employeeId) => {
        const response = await getWorkReferences(employeeId);
        return response.data;
    }
);
// fetchWorkReference es una acción asíncrona que obtiene una referencia laboral por su id
export const fetchWorkReference = createAsyncThunk(
    "workReferences/fetchWorkReference",
    async ({ employeeId, workReferenceId }) => {
        const response = await getWorkReference(employeeId, workReferenceId);
        return response.data;
    }
);

// createNewWorkReference es una acción asíncrona que crea una nueva referencia laboral
export const createNewWorkReference = createAsyncThunk(
    "workReferences/createNewWorkReference",
    async ({ employeeId, newWorkReference }) => {
        const response = await createWorkReference(employeeId, newWorkReference);
        return response.data;
    }
);

// updateOneWorkReference es una acción asíncrona que actualiza una referencia laboral existente
export const updateOneWorkReference = createAsyncThunk(
    "workReferences/updateOneWorkReference",
    async ({ employeeId, updateWorkReference }) => {
        console.log('redux',updateWorkReference);
        const response = await updateWorkReferenceService(employeeId, updateWorkReference.id, updateWorkReference);
        return response.data;
    }
);

// deleteOneWorkReference es una acción asíncrona que elimina una referencia laboral existente
export const deleteOneWorkReference = createAsyncThunk(
    "workReferences/deleteOneWorkReference",
    async ({ employeeId, workReferenceId }) => {
        const response = await deleteWorkReference(employeeId, workReferenceId);
        return response.data;
    }
);

// workReferenceSlice es un slice de Redux que maneja el estado de las referencias laborales en nuestra aplicación
// Este slice contiene los reducers y actions necesarios para manejar las referencias laborales
export const workReferenceSlice = createSlice({
    name: "workReferences",
    initialState: {
        workReferences: [],
        workReference: {},
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkReferences.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWorkReferences.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workReferences = action.payload;
            })
            .addCase(fetchWorkReferences.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchWorkReference.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWorkReference.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workReference = action.payload;
            })
            .addCase(fetchWorkReference.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createNewWorkReference.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createNewWorkReference.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.workReferences.push(action.payload);
            })
            .addCase(createNewWorkReference.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(updateOneWorkReference.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateOneWorkReference.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedWorkReference = action.payload;
                console.log('redux',updatedWorkReference);
                state.workReferences = state.workReferences.map((workReference) => {
                    if (workReference.id === updatedWorkReference.id) {
                        return updatedWorkReference;
                    }
                    return workReference;
                });
            })
            .addCase(updateOneWorkReference.rejected, (state, action) => {
                state.status = "failed";
                state.error = JSON.parse(action.error.message);
            })
            .addCase(deleteOneWorkReference.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteOneWorkReference.fulfilled, (state, action) => {
                if (action.payload) {
                    state.status = "succeeded";
                    state.workReferences = state.workReferences.filter(
                        (workReference) => workReference.id !== action.payload.id
                    );
                }
                state.status = "succeeded";
            })
            .addCase(deleteOneWorkReference.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default workReferenceSlice.reducer;