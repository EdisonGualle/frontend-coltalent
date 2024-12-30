import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllEmployeeSchedules, assignSchedule, clearErrors, deleteSchedule } from "../../../../redux/Schedules/employeeSchedulesSlice";
import SchedulesTable from "../Table/SheduleTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
    assignmentFixedColumns,
    assignmentVisibleColumns,
    assignmentGeneralColumns,
    dynamicFilterColumns,
} from "./Table/schedulesAssignmentColumns";
import { getAllCellStyle } from "./Table/schedulesAssignmentColumnsStyles";
import renderAssignmentActions from "./Table/renderAssignmentActions";
import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { RiCheckboxCircleLine, RiCloseCircleLine, RiCalendarScheduleLine, RiDeleteBin6Line} from "react-icons/ri";
import ScheduleAssignmentForm from "./components/ScheduleAssignmentForm";


const schedulesAssignment = () => {
    const dispatch = useDispatch();
    const { employeeSchedules, fetchStatus, error, hasFetchedAll } = useSelector(
        (state) => state.employeeSchedules
    );

    const { showAlert } = useContext(AlertContext);

    // Estados
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // Errores del formulario
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);

    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchAllEmployeeSchedules());
        }
    }, [dispatch, hasFetchedAll]);

    // Abrir modal para asignar un nuevo horario a un empleado
    const handleOpenCreateModal = () => {
        setCreateModalOpen(true);
        setFormErrors({});
        dispatch(clearErrors());
    }

    // Cerrar modal para asignar un nuevo horario a un empleado
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    };

    // Crear horario y actualizar la tabla automaticamente mediante Redux
    const handleCreateSubmit = async (formData) => {
        const { employee_id, ...payload } = formData;
        setIsCreating(true); 
        try {
            await dispatch(assignSchedule({ employeeId: employee_id, scheduleData: payload })).then(unwrapResult);
            handleCloseCreateModal();
            showAlert("Horario assignado correctamete", "success");
        } catch (error) {
            setFormErrors(error.errors || {});
            showAlert(error.message || "Error al asignar el horario", "error");
        } finally {
            setIsCreating(false);
        }
    };

    // Eliminar horario asignado
    const handleDelete = (row) => {
        setScheduleToDelete(row);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await dispatch(deleteSchedule(scheduleToDelete.id)).then(unwrapResult);
            showAlert("Asignación eliminada correctamente", "success");
        } catch (error) {
            showAlert(error.message || "Error al eliminar la asignación.", "error");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setScheduleToDelete(null);
        }
    };



    return (
        <div className="">
            {fetchStatus === "loading" && employeeSchedules.length === 0 && <LoadingIndicator />}
            {fetchStatus === "failed" && <p>Error al obtener horarios assignados: {error}</p>}

            {/* Solo mostramos la tabla si hay datos */}
            {fetchStatus === "succeeded" && employeeSchedules.length > 0 && (
                <div className="">
                    <SchedulesTable
                        allColumns={assignmentGeneralColumns}
                        columns={[...assignmentFixedColumns, ...assignmentVisibleColumns]}
                        fixedColumns={assignmentFixedColumns}
                        getCellStyle={getAllCellStyle}
                        data={employeeSchedules}
                        dynamicFilterColumns={dynamicFilterColumns}
                        showActions={true}
                        showAddNew={true}
                        onAddNew={handleOpenCreateModal}
                        actions={(row) =>
                            renderAssignmentActions({
                                row,
                                onDelete: handleDelete,
                            })
                        }
                    />
                </div>
            )}

            {/* Si no hay datos disponibles, mostramos un mensaje */}
            {employeeSchedules.length === 0 && fetchStatus !== "loading" && (
                <p className="py-10 text-gray-400 text-center">No hay horarios asignados a empleados para mostrar.</p>
            )}

            {/* Modal para confirmar la eliminación de un horario */}
            <Dialog2
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                title="¿Desea eliminar esta asignación?"
                description="Esta acción es irreversible y la asignación se eliminará permanentemente."
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
                cancelButtonColor="border-gray-400"
                confirmButtonColor="bg-red-500"
                isLoading={isDeleting} 
                icon={<RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />}
            />

            {/* Modal para asignar un nuevo horario a un empleado */}
            <ModalForm
                isOpen={isCreateModalOpen}
                setIsOpen={setCreateModalOpen}
                title="Asignar Horario"
                icon={<RiCalendarScheduleLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
                maxWidth="max-w-lg"
            >
                <ScheduleAssignmentForm
                    isEditing={false}
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCloseCreateModal}
                    formErrors={formErrors}
                    isSubmitting={isCreating}
                />
            </ModalForm>
        </div>
    );
};

export default schedulesAssignment;
