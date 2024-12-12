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
} from "./Table/allColumns";
import { getAllCellStyle } from "./Table/allColumnsStyles";
import { exportToExcel } from "../Table/exportToExcel";
import { exportToPdf } from "../Table/exportToPdf";

const AllDelegations = () => {
  const dispatch = useDispatch();
  const { allDelegations, status, error, hasFetchedAll } = useSelector((state) => state.delegations);

  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllDelegations());
    }
  }, [dispatch, hasFetchedAll]);

  const handleExport = (data, columns, options = {}) => {
    const { filename = "archivo_exportado", sheetName = "Hoja1", format = "excel" } = options;

    // Generar un identificador único basado en la fecha y hora actual
    const uniqueId = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const baseFilename = filename.replace(/\.(xlsx|pdf)$/, ""); // Eliminar extensión si existe
    const uniqueFilename = `${baseFilename}_${uniqueId}`;

    // Combinar columnas fijas y columnas visibles
    const exportColumns = [...new Set([...allFixedColumns, ...columns])];

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
        subtitle: "Detalles del historial de subrogación",
      });
    }
  };

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
          showDateRangeFilter={true}
          getCellStyle={getAllCellStyle}
          data={allDelegations}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={false}
          showAddNew={false}
          showExport={true} 
          exportFunction={(data, columns, format) =>
            handleExport(data, columns, {
              filename: "historial_subrogaciones",
              sheetName: "Historial subrogaciones",
              format,
            })
          }
        />
      </div>
    )}

    {/* Si no hay datos disponibles, mostramos un mensaje */}
    {allDelegations.length === 0 && status !== "loading" && (
      <p>No hay historial de subrogaciones para mostrar.</p>
    )}
  </div>
  );
};

export default AllDelegations;
