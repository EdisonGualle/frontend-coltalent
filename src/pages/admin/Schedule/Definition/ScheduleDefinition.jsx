import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllSchedules, addNewSchedule, clearErrors, deleteExistingSchedule, restoreDeletedSchedule, updateExistingSchedule } from "../../../../redux/Schedules/ScheduleSlince";
import SchedulesTable from "../Table/SheduleTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  scheduleFixedColumns,
  scheduleGeneralColumns,
  dynamicFilterColumns,
  scheduleVisibleColumns,
} from "./Table/schedulesDefinitionColumns";
import { getAllCellStyle } from "./Table/schedulesDefinitionColumnsStyles";
import renderDefinitionActions from "./Table/renderDefinitionActions";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { AlertContext } from "../../../../contexts/AlertContext";
import ScheduleDefinitionForm from "./components/ScheduleDefinitionForm";
import { RiCheckboxCircleLine, RiCloseCircleLine, RiCalendarScheduleLine } from "react-icons/ri";

const ScheduleDefinition = () => {
  const dispatch = useDispatch();
  const { schedules, fetchStatus, error, hasFetchedAll } = useSelector(
    (state) => state.schedules
  );

  const { showAlert } = useContext(AlertContext);

  // Estados
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusDialogMessage, setStatusDialogMessage] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllSchedules());
    }
  }, [dispatch, hasFetchedAll]);


  // Abrir modal para crear un nuevo horario
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para crear un nuevo horario
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Crear horario y actualizar la tabla automaticamente mediante Redux
  const handleCreateSubmit = async (scheduleData) => {
    try {
      await dispatch(addNewSchedule(scheduleData)).then(unwrapResult);
      handleCloseCreateModal();
      showAlert("Horario creado correctamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al crear el horario", "error");
    }
  }

  // Abrir modal para editar un horario
  const handleOpenEditModal = (row) => {
    setCurrentSchedule(row);
    setEditModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para editar un horario
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Actualizar horario y tabla local
  const handleEditSubmit = async (scheduleData) => {
    try {
      await dispatch(updateExistingSchedule({ id: currentSchedule.id, scheduleData })).then(unwrapResult);
      handleCloseEditModal();
      showAlert("Horario actualizado correctamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al actualizar el horario", "error");
    }
  };

  // Personalizar el mensaje del diálogo
  const getStatusDialogMessage = (status) => {
    return status === "Activo"
      ? {
        title: "¿Está seguro de desactivar este horario?",
        description: "Desactivar este horario puede interrumpir tareas y procesos relacionados. Esta acción es reversible.",
        confirmButtonText: "Desactivar",
        confirmButtonColor: "bg-yellow-500",
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />,
      }
      : {
        title: "¿Está seguro de activar este horario?",
        description: "Activar este horario reanudará su uso en los procesos relacionados. Esta acción es reversible.",
        confirmButtonText: "Activar",
        confirmButtonColor: "bg-green-500",
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />,
      };
  };

  // Mostrar diálogo para activar/desactivar horario
  const handleToggleScheduleStatus = (row) => {
    setCurrentSchedule(row);
    setStatusDialogMessage(getStatusDialogMessage(row.status));
    setIsStatusDialogOpen(true);
  };

  // Confirmar cambio de estado del horario
  const handleConfirmStatusChange = async () => {
    setIsStatusDialogOpen(false);
    try {
      if (currentSchedule.status === "Activo") {
        await dispatch(deleteExistingSchedule(currentSchedule.id)).then(unwrapResult);
        showAlert(`Horario desactivado correctamente.`, "success", 2000);
      } else {
        await dispatch(restoreDeletedSchedule(currentSchedule.id)).then(unwrapResult);
        showAlert(`Horario activado correctamente.`, "success", 2000);
      }
    } catch (error) {
      showAlert(error.message || "Error al realizar la acción.", "error");
    }
  };

  // Cancelar cambio de estado del horario
  const handleCancelStatusChange = () => {
    setIsStatusDialogOpen(false);
  };


  return (
    <div className="">
      {fetchStatus === "loading" && schedules.length === 0 && <LoadingIndicator />}
      {fetchStatus === "failed" && <p>Error al obtener horarios: {error}</p>}

      {/* Solo mostramos la tabla si hay datos */}
      {fetchStatus === "succeeded" && schedules.length > 0 && (
        <div className="">
          <SchedulesTable
            allColumns={scheduleGeneralColumns}
            columns={[...scheduleFixedColumns, ...scheduleVisibleColumns]}
            fixedColumns={scheduleFixedColumns}
            getCellStyle={getAllCellStyle}
            data={schedules}
            dynamicFilterColumns={dynamicFilterColumns}
            showActions={true}
            showAddNew={true}
            onAddNew={handleOpenCreateModal}
            actions={(row) =>
              renderDefinitionActions({
                row,
                onEdit: handleOpenEditModal,
                onToggleStatus: () => handleToggleScheduleStatus(row),
              })
            }
          />
        </div>
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}
      {schedules.length === 0 && fetchStatus !== "loading" && (
        <p className="py-10 text-gray-400 text-center">No hay horarios para mostrar.</p>
      )}

      {/* Diálogo de confirmación para cambiar el estado del horario */}
      <Dialog2
        isOpen={isStatusDialogOpen}
        setIsOpen={setIsStatusDialogOpen}
        title={statusDialogMessage.title}
        description={statusDialogMessage.description}
        confirmButtonText={statusDialogMessage.confirmButtonText}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
        cancelButtonColor="border-gray-400"
        confirmButtonColor={statusDialogMessage.confirmButtonColor}
        icon={statusDialogMessage.icon}
      />

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
          onCancel={handleCloseCreateModal}
          formErrors={formErrors}
        />
      </ModalForm>


      <ModalForm
        isOpen={isEditModalOpen}
        setIsOpen={setEditModalOpen}
        title="Editar horario"
        icon={<RiCalendarScheduleLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-lg"
      >
        <ScheduleDefinitionForm
          isEditing={true}
          initialData={currentSchedule}
          onSubmit={handleEditSubmit}
          onCancel={handleCloseEditModal}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default ScheduleDefinition;
