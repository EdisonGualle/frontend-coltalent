import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { fetchAssignedDelegations } from "../../../../redux/Delegations/delegationsSlice";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import SubrogationsTable from "../Table/SubrogationsTable";
import { exportToExcel } from "../Table/exportToExcel";
import { exportToPdf } from "../Table/exportToPdf";

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
    const { filename = "archivo_exportado", sheetName = "Hoja1", format = "excel" } = options;

    // Generar un identificador único basado en la fecha y hora actual
    const uniqueId = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const baseFilename = filename.replace(/\.(xlsx|pdf)$/, ""); // Eliminar extensión si existe
    const uniqueFilename = `${baseFilename}_${uniqueId}`;

    // Combinar columnas fijas y columnas visibles
    const exportColumns = [...new Set([...assignedFixedColumns, ...columns])];

    // Manejar exportación según el formato
    if (format === "excel") {
      exportToExcel(data, exportColumns, {
        filename: `${uniqueFilename}.xlsx`,
        sheetName,
      });
    } else if (format === "pdf") {
      console.log("Exportando a PDF...");
      exportToPdf(data, exportColumns, {
        filename: `${uniqueFilename}.pdf`,
        title: sheetName,
      });
    }
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
            exportFunction={(data, columns, format) =>
              handleExport(data, columns, {
                filename: "delegaciones_asignadas",
                sheetName: "Delegaciones",
                format, // "excel" o "pdf"
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
