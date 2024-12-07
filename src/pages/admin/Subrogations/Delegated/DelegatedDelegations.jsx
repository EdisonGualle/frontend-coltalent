import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { fetchDelegatedByEmployee } from "../../../../redux/Delegations/delegationsSlice";
import SubrogationsTable from "../Table/SubrogationsTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  delegatedFixedColumns,
  delegatedGeneralColumns,
  delegatedVisibleColumns,
  dynamicFilterColumns,
  manualFiltersConfig,
} from "./Table/delegatedColumns";

const DelegatedDelegations = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { delegatedBy, status, error, hasFetchedDelegated } = useSelector((state) => state.delegations);

  useEffect(() => {
    if (user?.employee_id && !hasFetchedDelegated) {
      dispatch(fetchDelegatedByEmployee(user.employee_id));
    }
  }, [dispatch, user?.employee_id, hasFetchedDelegated]);

  return (
    <div className="">
      {status === "loading" && delegatedBy.length === 0 && <LoadingIndicator />}
      {status === "failed" && <p>Error al obtener delegaciones: {error}</p>}

      {/* Solo mostramos la tabla si hay datos */}
      {status === "succeeded" && delegatedBy.length > 0 && (
        <div className="">
          <SubrogationsTable
            allColumns={delegatedGeneralColumns}
            columns={[...delegatedFixedColumns, ...delegatedVisibleColumns]}
            fixedColumns={delegatedFixedColumns}
            manualFiltersConfig={manualFiltersConfig}
            dynamicFilterColumns={dynamicFilterColumns}
            data={delegatedBy}
            showActions={false}
            showAddNew={false}
          />
        </div>
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}
      {delegatedBy.length === 0 && status !== "loading" && (
        <p>No hay delegaciones asignadas para mostrar.</p>
      )}
    </div>
  );
};

export default DelegatedDelegations;
