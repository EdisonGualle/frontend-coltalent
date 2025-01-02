import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllContractTypes,
    getContractTypeById,
    createContractType,
    updateContractType,
    deleteContractType,
    restoreContractType,
} from "../../services/Contracts/contractTypeService";

// Acción asíncrona para obtener todos los tipos de contrato
export const fetchAllContractTypes = createAsyncThunk(
    "contractTypes/fetchAllContractTypes",
    async () => {
        const response = await getAllContractTypes();
        return response.data;
    }
);

// Acción asíncrona para obtener un tipo de contrato por ID
export const fetchContractTypeById = createAsyncThunk(
    "contractTypes/fetchContractTypeById",
    async (id) => {
        const response = await getContractTypeById(id);
        return response.data;
    }
);

// Acción asíncrona para crear un nuevo tipo de contrato
export const createContract = createAsyncThunk(
    "contractTypes/createContract",
    async (contractTypeData, { rejectWithValue }) => {
        try {
            const response = await createContractType(contractTypeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para actualizar un tipo de contrato
export const updateContract = createAsyncThunk(
    "contractTypes/updateContract",
    async ({ id, contractTypeData }, { rejectWithValue }) => {
        try {
            const response = await updateContractType(id, contractTypeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para eliminar un tipo de contrato
export const deleteContract = createAsyncThunk(
    "contractTypes/deleteContract",
    async (id) => {
        const response = await deleteContractType(id);
        return response.data;
    }
);

// Acción asíncrona para restaurar un tipo de contrato
export const restoreContract = createAsyncThunk(
    "contractTypes/restoreContract",
    async (id) => {
        const response = await restoreContractType(id);
        return response.data;
    }
);

const contractTypeSlice = createSlice({
    name: "contractTypes",
    initialState: {
        contractTypes: [],
        contractType: {},
        fetchStatus: "idle", // Estado para obtener todos los tipos de contrato
        createStatus: "idle", // Estado para crear un tipo de contrato
        updateStatus: "idle", // Estado para actualizar un tipo de contrato
        deleteStatus: "idle", // Estado para eliminar un tipo de contrato
        restoreStatus: "idle", // Estado para restaurar un tipo de contrato
        error: null, // Mensajes de error general
        fieldErrors: {}, // Errores de validación de campos
        hasFetchedAll: false,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.fieldErrors = {};
        }
    },
    extraReducers: (builder) => {
        builder

            // Obtener todos los tipos de contrato
            .addCase(fetchAllContractTypes.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllContractTypes.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.contractTypes = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllContractTypes.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message;
                state.hasFetchedAll = false;
            })

            // Crear un nuevo tipo de contrato
            .addCase(createContract.pending, (state) => {
                state.createStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.contractTypes.unshift(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.createStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })

            // Actualizar un tipo de contrato
            .addCase(updateContract.pending, (state) => {
                state.updateStatus = "loading";
                state.error = null; // Limpiar errores generales
                state.fieldErrors = {}; // Limpiar errores de validación
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const index = state.contractTypes.findIndex(
                    (contractType) => contractType.id === action.payload.id);
                if (index !== -1) {
                    state.contractTypes[index] = action.payload;
                }
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.updateStatus = "failed";
                const { message, errors } = action.payload || {};
                state.error = message || null;
                state.fieldErrors = errors || {};
            })
            // Eliminar un tipo de contrato
            .addCase(deleteContract.pending, (state) => {
                state.deleteStatus = "loading";
            })
            .addCase(deleteContract.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
                // Actualizar el estado del contrato eliminado
                state.contractTypes = state.contractTypes.map((contractType) =>
                    contractType.id === action.payload.id ? action.payload : contractType
                );
            })
            .addCase(deleteContract.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.error = action.error.message;
            })

            // Restaurar un tipo de contrato
            .addCase(restoreContract.pending, (state) => {
                state.restoreStatus = "loading";
            })
            .addCase(restoreContract.fulfilled, (state, action) => {
                state.restoreStatus = "succeeded";
                // Actualizar el estado del contrato restaurado
                state.contractTypes = state.contractTypes.map((contractType) =>
                    contractType.id === action.payload.id ? action.payload : contractType
                );
            })
            .addCase(restoreContract.rejected, (state, action) => {
                state.restoreStatus = "failed";
                state.error = action.error.message;
            });

    }
});

export const { clearErrors } = contractTypeSlice.actions;
export default contractTypeSlice.reducer;