import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllEmployeeSchedules, assignSchedule, clearErrors } from "../../../../redux/Schedules/employeeSchedulesSlice";
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
import { RiCheckboxCircleLine, RiCloseCircleLine, RiCalendarScheduleLine } from "react-icons/ri";
import ScheduleAssignmentForm from "./components/ScheduleAssignmentForm";


const schedulesAssignment = () => {
    const dispatch = useDispatch();
    const { employeeSchedules, fetchStatus, error, hasFetchedAll } = useSelector(
        (state) => state.employeeSchedules
    );

    const { showAlert } = useContext(AlertContext);

    // Estados
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // Errores del formulario

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
        console.log("Datos enviados al backend:", formData);
        const { employee_id, ...payload } = formData;
        try {
            await dispatch(assignSchedule({ employeeId: employee_id, scheduleData: payload })).then(unwrapResult);

            handleCloseCreateModal();
            showAlert("Horario assignado correctamete", "success");
        } catch (error) {
            setFormErrors(error.errors || {});
            showAlert(error.message || "Error al asignar el horario", "error");
        }
    };


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
                                onEdit: handleEdit,
                                onDelete: handleDelete,
                            })
                        }
                    />
                </div>
            )}

            {/* Si no hay datos disponibles, mostramos un mensaje */}
            {employeeSchedules.length === 0 && fetchStatus !== "loading" && (
                <p className="py-10 text-gray-400 text-center">NNo hay horarios asignados a empleados para mostrar.</p>
            )}
            
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
                />
            </ModalForm>
        </div>
    );
};

export default schedulesAssignment;
