import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllHolidayAssignments, assignHoliday, deleteHoliday, clearErrors } from "../../../../redux/Holidays/holidaysAssignmentSlince";
import HolidaysTable from "../Table/HolidaysTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  assignmentsFixedColumns,
  assignmentsVisibleColumns,
  assignmentsGeneralColumns,
  dynamicFilterColumns,
} from "./Table/assignmentsColumns";

import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { LiaCalendarDaySolid } from "react-icons/lia";

import AsssignmentManagementForm from "./components/AsssignmentManagementForm";

const AssignmentsManagement = () => {
  const dispatch = useDispatch();
  const { holidayAssignments, fetchStatus, error, hasFetchedAll } = useSelector(
    (state) => state.holidayAssignments
  );

  const { showAlert } = useContext(AlertContext);

  // Estados
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);


  // Obtener todas las asignaciones de días festivos
  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllHolidayAssignments());
    }
  }, [dispatch, hasFetchedAll]);

  // Abrir modal para crear una nueva asignación de día festivo
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para crear una nueva asignación de día festivo
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Crear una nueva asignación de día festivo y actualizar la tabla automaticamnte 
  const handleCreatesubmit = async (formData) => {
    setIsCreating(true);
    try {
      const result = await dispatch(assignHoliday({ id: formData.holiday, data: formData.employees })).then(unwrapResult);
      const message = result?.msg || "Asignación de día festivo creada exitosamente";
      showAlert(message, "success", 3000);
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al crear el día festivo", "error");
    } finally {
      setIsCreating(false);
      handleCloseCreateModal();
    }
  };

  // Abrir diálogo de confirmación de eliminación
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => setIsOpenDialogDelete(false);


  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteHoliday({data: selectedIds})).then(unwrapResult);
      showAlert(`Se eliminaron ${result.data.ids.length} asignaciones correctamente.`, "success");
    } catch (error) {
      showAlert(error.message || "Error al eliminar las asignaciones", "error");
    } finally {
      setIsOpenDialogDelete(false);
      setIsDeleting(false);
    }
  };
  return (
    <>
      {fetchStatus === "loading" && <LoadingIndicator />}
      {fetchStatus === "failed" && showAlert("Error al cargar los días festivos asignados", "error")}

      {/* Solo mostramos la tabla si hay datos */}
      {fetchStatus === "succeeded" && holidayAssignments.length > 0 && (
        <HolidaysTable
          allColumns={assignmentsGeneralColumns}
          columns={[...assignmentsFixedColumns, ...assignmentsVisibleColumns]}
          fixedColumns={assignmentsFixedColumns}
          data={holidayAssignments}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={false}
          showFilters={true}
          showAddNew={true}
          onAddNew={handleOpenCreateModal}
          onDelete={handleClickDelete}
        />
      )}
      {/*Si no hay datos disponibles, mostrar mensaje*/}
      {holidayAssignments.length === 0 && fetchStatus !== "loading" && (
        <div className="py-10 text-gray-400 text-center">No hay  días festivos asignados para mostrar</div>
      )}


      {/* Modal para crar un nuevo  dia festivo */}
      <ModalForm
        isOpen={isCreateModalOpen}
        setIsOpen={setCreateModalOpen}
        title="Asignar día festivo"
        icon={<LiaCalendarDaySolid className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <AsssignmentManagementForm
          onSubmit={handleCreatesubmit}
          onCancel={handleCloseCreateModal}
          formErrors={formErrors}
          isSubmitting={isCreating}
        />
      </ModalForm>

      {/* Diálogo para confirmar eliminación */}
      <Dialog2
        isOpen={isOpenDialogDelete}
        setIsOpen={setIsOpenDialogDelete}
        title={`¿Eliminar ${selectedIds.length > 1 ? "las asignaciones seleccionadas" : "la asignación seleccionada"}?`}
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length > 1 ? "estas asignaciones" : "esta asignación"
          }? Esta acción es permanente y no se podrá deshacer.`}
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        isLoading={isDeleting}
      />

    </>
  )
}

export default AssignmentsManagement