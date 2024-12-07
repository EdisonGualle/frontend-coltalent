import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDelegations } from "../../../../redux/Delegations/delegationsSlice";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import SubrogationsTable from "../Table/SubrogationsTable";
import {
  allFixedColumns,
  allGeneralColumns,
  allVisibleColumns,
  dynamicFilterColumns,
  manualFiltersConfig,
} from "./Table/allColumns";

const AllDelegations = () => {
  const dispatch = useDispatch();
  const { allDelegations, status, error, hasFetchedAll } = useSelector((state) => state.delegations);

  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllDelegations());
    }
  }, [dispatch, hasFetchedAll]);

  console.log(allDelegations)

  return (
    <div className="">
    {status === "loading" && allDelegations.length === 0 && <LoadingIndicator />}
    {status === "failed" && <p>Error al obtener delegaciones: {error}</p>}

    {/* Solo mostramos la tabla si hay datos */}
    {status === "succeeded" && allDelegations.length > 0 && (
      <div className="">
        <SubrogationsTable
          allColumns={allGeneralColumns}
          columns={[...allFixedColumns, ...allVisibleColumns]}
          fixedColumns={allFixedColumns}
          manualFiltersConfig={manualFiltersConfig}
          data={allDelegations}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={false}
          showAddNew={false}
        />
      </div>
    )}

    {/* Si no hay datos disponibles, mostramos un mensaje */}
    {assignedDelegations.length === 0 && status !== "loading" && (
      <p>No hay delegaciones asignadas para mostrar.</p>
    )}
  </div>
  );
};

export default AllDelegations;
