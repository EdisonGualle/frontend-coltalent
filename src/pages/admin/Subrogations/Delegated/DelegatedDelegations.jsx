import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { fetchAllDelegations, fetchDelegatedByEmployee } from "../../../../redux/Delegations/delegationsSlice";
import SubrogationsTable from "../Table/SubrogationsTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  delegatedFixedColumns,
  delegatedGeneralColumns,
  delegatedVisibleColumns,
  dynamicFilterColumns,
} from "./Table/delegatedColumns";

import { getDelegatedCellStyle } from "./Table/delegatedColumnsStyles";
import { exportToExcel } from "../Table/exportToExcel";
import { exportToPdf } from "../Table/exportToPdf";

const DelegatedDelegations = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { delegatedBy, status, error, hasFetchedDelegated } = useSelector((state) => state.delegations);

  useEffect(() => {
    if (user?.employee_id && !hasFetchedDelegated) {
      dispatch(fetchDelegatedByEmployee(user.employee_id));
    }
  }, [dispatch, user?.employee_id, hasFetchedDelegated]);

  // Lógica para ocultar columnas según el rol
  const getVisibleColumnsByRole = (columns) => {
    return columns.filter((column) => {
      if (
        (column.id === "original_leave.requested_by.position.unit" || column.id === "original_leave.requested_by.position.direction") &&
        (user?.role === "Administrador" || user?.role === "Jefe Unidad")
      ) {
        return false; // Oculta estas columnas
      }
      return true; // Mantén las demás columnas
    });
  };

    // Aplicar la lógica a las columnas generales y dinámicas
    const visibleColumnsByRole = getVisibleColumnsByRole(delegatedGeneralColumns);
    
    const dynamicFiltersByRole = dynamicFilterColumns.filter((filter) => {
      if (
        // Ocultar si el filtro es unidad o dirección y el rol es Administrador o Jefe Unidad
        (filter.column === "original_leave.requested_by.position.unit" ||
          filter.column === "original_leave.requested_by.position.direction") &&
        (user?.role === "Administrador" || user?.role === "Jefe Unidad")
      ) {
        return false;
      }
    
      // Ocultar si el filtro es dirección y el cargo es Jefe Dirección
      if (
        filter.column === "original_leave.requested_by.position.direction" &&
        user?.position === "Jefe Dirección"
      ) {
        return false;
      }
    
      return true; // Mantener los demás filtros
    });
    

  const handleExport = (data, columns, options = {}) => {
    const { filename = "archivo_exportado", sheetName = "Hoja1", format = "excel" } = options;

    // Generar un identificador único basado en la fecha y hora actual
    const uniqueId = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const baseFilename = filename.replace(/\.(xlsx|pdf)$/, ""); // Eliminar extensión si existe
    const uniqueFilename = `${baseFilename}_${uniqueId}`;

    // Combinar columnas fijas y columnas visibles
    const exportColumns = [...new Set([...delegatedFixedColumns, ...columns])];

    // Manejar exportación según el formato
    if (format === "excel") {
      exportToExcel(data, exportColumns, {
        filename: `${uniqueFilename}.xlsx`,
        sheetName,
      });
    } else if (format === "pdf") {
      exportToPdf(data, exportColumns, {
        filename: `${uniqueFilename}.pdf`,
        title: sheetName,
        subtitle: "Detalles de los periodos de subrogaciones delegadas",
      });
    }
  };
  

  return (
    <div className="">
      {status === "loading" && delegatedBy.length === 0 && <LoadingIndicator />}
      {status === "failed" && <p>Error al obtener delegaciones: {error}</p>}

      {/* Solo mostramos la tabla si hay datos */}
      {status === "succeeded" && delegatedBy.length > 0 && (
        <div className="">
          <SubrogationsTable
            allColumns={visibleColumnsByRole}
            columns={[...delegatedFixedColumns, ...delegatedVisibleColumns]}
            fixedColumns={delegatedFixedColumns}
            showDateRangeFilter={true}
            dynamicFilterColumns={dynamicFiltersByRole}
            getCellStyle={getDelegatedCellStyle}
            data={delegatedBy}
            showActions={false}
            showAddNew={false}
            showExport={true} 
            exportFunction={(data, columns, format) =>
              handleExport(data, columns, {
                filename: "delegaciones_delegadas",
                sheetName: "Delegaciones delegadas",
                format,
              })
            }
          />
        </div>
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}
      {delegatedBy.length === 0 && status !== "loading" && (
        <p>No hay delegaciones delegadas para mostrar.</p>
      )}
    </div>
  );
};

export default DelegatedDelegations;
