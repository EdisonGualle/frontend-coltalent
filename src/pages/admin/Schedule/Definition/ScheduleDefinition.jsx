import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSchedules, addNewSchedule } from "../../../../redux/Schedules/ScheduleSlince";
import SchedulesTable from "../Table/SheduleTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  scheduleFixedColumns,
  scheduleGeneralColumns,
  dynamicFilterColumns,
} from "./Table/schedulesDefinitionColumns";
import { getAllCellStyle } from "./Table/schedulesDefinitionColumnsStyles";
import renderDefinitionActions from "./Table/renderDefinitionActions";
import ModalForm from "../../../../components/ui/ModalForm";
import { AlertContext } from "../../../../contexts/AlertContext";
import ScheduleDefinitionForm from "./components/ScheduleDefinitionForm";
import { RiCalendarScheduleLine } from "react-icons/ri";

const ScheduleDefinition = () => {
  const dispatch = useDispatch();
  const { schedules, status, error, hasFetchedAll } = useSelector(
    (state) => state.schedules
  );

  const { showAlert } = useContext(AlertContext);

  // Estados
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Modal de creación
  const [formErrors, setFormErrors] = useState({}); // Errores del formulario

  // Datos locales para la tabla
  const [localSchedules, setLocalSchedules] = useState([]);


  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllSchedules());
    }
  }, [dispatch, hasFetchedAll]);

  useEffect(() => {
    if (status === "succeeded") {
      setLocalSchedules(schedules); 
    }
  }, [schedules, status]);


    // Abrir y cerrar modal
    const handleOpenCreateModal = () => setCreateModalOpen(true);
    const handleCloseModal = () => {
      setCreateModalOpen(false);
      setFormErrors({});
    };
    
  // Crear horario y actualizar la tabla
  const handleCreateSubmit = async (scheduleData) => {
    try {
      const result = await dispatch(createNewSchedule(scheduleData));
      const newSchedule = await unwrapResult(result);

      // Agregar el nuevo horario directamente a la tabla
      setLocalSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
      handleCloseModal();
      showAlert("Horario creado correctamente", "success");
    } catch (error) {
      const errorData = JSON.parse(error.message);
      setFormErrors(errorData.errors || {});
    }
  }


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
            data={localSchedules}
            dynamicFilterColumns={dynamicFilterColumns}
            showActions={true}
            showAddNew={true}
            onAddNew={handleOpenCreateModal}
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



       {/* Modal para crear un horario */}
       <ModalForm
        isOpen={isCreateModalOpen}
        setIsOpen={setCreateModalOpen}
        title="Crear nuevo horario"
         icon={<RiCalendarScheduleLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-lg"
      >
        <ScheduleDefinitionForm
          isEditing={false}
          onSubmit={handleCreateSubmit}
          onCancel={handleCloseModal}
          formErrors={formErrors}
        />
      </ModalForm>


    </div>
  );
};

export default ScheduleDefinition;
