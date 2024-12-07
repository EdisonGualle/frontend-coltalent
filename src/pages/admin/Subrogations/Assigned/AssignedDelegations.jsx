import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { fetchAssignedDelegations } from "../../../../redux/Delegations/delegationsSlice";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import SubrogationsTable from "../Table/SubrogationsTable";
import { exportToExcel } from "../Table/exportToExcel";
import {
  assignedFixedColumns,
  assignedGeneralColumns,
  assignedVisibleColumns,
  dynamicFilterColumns,
  manualFiltersConfig,
} from "./Table/assignedColumns";


const AssignedDelegations = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { assignedDelegations, status, error, hasFetchedAssigned } = useSelector((state) => state.delegations);

  useEffect(() => {
    if (user?.employee_id && !hasFetchedAssigned) {
      dispatch(fetchAssignedDelegations(user.employee_id));
    }
  }, [dispatch, user?.employee_id, hasFetchedAssigned]);

  const handleExport = (data, columns, options = {}) => {
    const { filename = 'archivo_exportado.xlsx', sheetName = 'Hoja1' } = options;
  
    // Generar un identificador único más corto
    const uniqueId = new Date().getTime(); 
    const baseFilename = filename.replace('.xlsx', ''); 
    const uniqueFilename = `${baseFilename}_${uniqueId}.xlsx`; 
  
    const exportColumns = [...new Set([...assignedFixedColumns, ...columns])];
    exportToExcel(data, exportColumns, { filename: uniqueFilename, sheetName });
  };
  
  

  return (
    <div className="">
      {status === "loading" && assignedDelegations.length === 0 && <LoadingIndicator />}
      {status === "failed" && <p>Error al obtener delegaciones: {error}</p>}

      {status === "succeeded" && assignedDelegations.length > 0 && (
        <div className="">
          <SubrogationsTable
            allColumns={assignedGeneralColumns}
            columns={[...assignedFixedColumns, ...assignedVisibleColumns]}
            fixedColumns={assignedFixedColumns}
            showDateRangeFilter={true}
            // manualFiltersConfig={manualFiltersConfig}
            data={assignedDelegations}
            dynamicFilterColumns={dynamicFilterColumns}
            showActions={false}
            showAddNew={false}
            showExport={true} 
            exportFunction={(data, columns) =>
              handleExport(data, columns, {
                filename: 'delegaciones_asignadas.xlsx', 
                sheetName: 'Delegaciones',
              })
            }
          />
        </div>
      )}

      {assignedDelegations.length === 0 && status !== "loading" && (
        <p>No hay delegaciones asignadas para mostrar.</p>
      )}
    </div>
  );
};

export default AssignedDelegations;
