import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSchedules } from "../../../../redux/Schedules/ScheduleSlince";
import SchedulesTable from "../Table/SheduleTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  scheduleFixedColumns,
  scheduleGeneralColumns,
  dynamicFilterColumns,
} from "./Table/schedulesDefinitionColumns";
import { getAllCellStyle } from "./Table/schedulesDefinitionColumnsStyles";
import renderDefinitionActions from "./Table/renderDefinitionActions";


const Schedules = () => {
  const dispatch = useDispatch();
  const { schedules, status, error, hasFetchedAll } = useSelector(
    (state) => state.schedules
  );

  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllSchedules());
    }
  }, [dispatch, hasFetchedAll]);


  const handleEdit = (row) => {
    console.log("Editar:", row);
    // Implementar lógica para editar
  };

  const handleDelete = (row) => {
    console.log("Eliminar:", row);
    // Implementar lógica para eliminar
  };

  return (
    <div className="">
      {status === "loading" && schedules.length === 0 && <LoadingIndicator />}
      {status === "failed" && <p>Error al obtener horarios: {error}</p>}

      {/* Solo mostramos la tabla si hay datos */}
      {status === "succeeded" && schedules.length > 0 && (
        <div className="">
          <SchedulesTable
            allColumns={scheduleGeneralColumns}
            columns={[...scheduleFixedColumns, ...scheduleGeneralColumns]}
            fixedColumns={scheduleFixedColumns}
            getCellStyle={getAllCellStyle}
            data={schedules}
            dynamicFilterColumns={dynamicFilterColumns}
            showActions={true}
            showAddNew={true}
            actions={(row) =>
              renderDefinitionActions({
                row,
                onEdit: handleEdit,
                onDelete: handleDelete,
              })
            }
          />
        </div>
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}
      {schedules.length === 0 && status !== "loading" && (
        <p>No hay horarios para mostrar.</p>
      )}
    </div>
  );
};

export default Schedules;
