import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDelegations, getAssignedDelegations, getDelegatedByEmployee } from "../../services/Delegations/delegationsService";

// Acción asíncrona para obtener delegaciones asignadas
export const fetchAssignedDelegations = createAsyncThunk(
  "delegations/fetchAssignedDelegations",
  async (employeeId) => {
    const response = await getAssignedDelegations(employeeId);
    return response.data;
  }
);

// Acción asíncrona para obtener delegaciones delegadas por un empleado
export const fetchDelegatedByEmployee = createAsyncThunk(
  "delegations/fetchDelegatedByEmployee",
  async (employeeId) => {
    const response = await getDelegatedByEmployee(employeeId);
    return response.data;
  }
);

// Acción asíncrona para obtener todas las delegaciones
export const fetchAllDelegations = createAsyncThunk(
  "delegations/fetchAllDelegations",
  async () => {
    const response = await getAllDelegations();
    return response.data;
  }
);
const delegationsSlice = createSlice({
  name: "delegations",
  initialState: {
    assignedDelegations: [],
    delegatedBy: [],
    status: "idle", 
    error: null,
    hasFetchedAssigned: false,
    hasFetchedDelegated: false,
    hasFetchedAll: false, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Delegaciones asignadas
      .addCase(fetchAssignedDelegations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedDelegations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignedDelegations = action.payload;
        state.hasFetchedAssigned = true; 
      })
      .addCase(fetchAssignedDelegations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.hasFetchedAssigned = false; 
      })

      // Delegaciones delegadas
      .addCase(fetchDelegatedByEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDelegatedByEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.delegatedBy = action.payload;
        state.hasFetchedDelegated = true;
      })
      .addCase(fetchDelegatedByEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.hasFetchedDelegated = false;
      })

      // Todas las delegaciones
      .addCase(fetchAllDelegations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllDelegations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allDelegations = action.payload;
        state.hasFetchedAll = true;
      })
      .addCase(fetchAllDelegations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.hasFetchedAll = false;
      });
  },
});


export default delegationsSlice.reducer;