import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllContractAssignments,
    createContractAssignment,
    getContractAssignmentById,
    renewContractAssignment,
    terminateContractAssignment,
} from "../../services/Contracts/contractAssignmentService";

// Acción asíncrona para obtener todos los contratos de empleado
export const fetchAllContractAssignments = createAsyncThunk(
    "contractAssignments/fetchAll",
    async () => {
        const response = await getAllContractAssignments();
        return response.data;
    }
);

// Acción asíncrona para crear un nuevo contrato
export const createNewContractAssignment = createAsyncThunk(
    "contractAssignments/createNew",
    async (contractData, { rejectWithValue }) => {
        try {
            const response = await createContractAssignment(contractData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para obtener un contrato por ID
export const fetchContractAssignmentById = createAsyncThunk(
    "contractAssignments/fetchById",
    async (id) => {
        const response = await getContractAssignmentById(id);
        return response.data;
    }
);

// Acción asíncrona para renovar un contrato por ID
export const renewExistingContractAssignment = createAsyncThunk(
    "contractAssignments/renewExisting",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await renewContractAssignment(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Acción asíncrona para terminar un contrato
export const terminateExistingContractAssignment = createAsyncThunk(
    "contractAssignments/terminateExisting",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await terminateContractAssignment(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const contractAssignmentSlice = createSlice({
    name: "contractAssignments",
    initialState: {
        contractAssignments: [],
        contractAssignment: {},
        fetchStatus: "idle", // Estado para obtener todos los contratos de empleado
        createStatus: "idle", // Estado para crear un contrato
        renewStatus: "idle", // Estado para renovar un contrato
        terminateStatus: "idle", // Estado para terminar un contrato
        error: null,    // Error general
        fieldErrors: {}, // Errores de validación de campos
        hasFetchedAll: false, // Estado para saber si se han obtenido todos los contratos
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.fieldErrors = {};
        },
    },
    extraReducers: (builder) => {
        builder

            // Obtener todos los contratos de empleado
            .addCase(fetchAllContractAssignments.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchAllContractAssignments.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.contractAssignments = action.payload;
                state.hasFetchedAll = true;
            })
            .addCase(fetchAllContractAssignments.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.payload?.message;
            })
    },
});

export const { clearErrors } = contractAssignmentSlice.actions;
export default contractAssignmentSlice.reducer;