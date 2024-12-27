import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployeeSchedules } from "../../../../redux/Schedules/employeeSchedulesSlice";
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
import AssignEmployeeScheduleForm from "./components/AssignEmployeeScheduleForm";
import ModalForm from "../../../../components/ui/ModalForm";
import { RiCalendarScheduleLine } from "react-icons/ri";


const schedulesAssignment = () => {
    const dispatch = useDispatch();
    const { employeeSchedules, status, error, hasFetchedAll } = useSelector(
        (state) => state.employeeSchedules
    );

    const { showAlert } = useContext(AlertContext);

    // Estados
    const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Modal de creación
    const [formErrors, setFormErrors] = useState({}); // Errores del formulario

    // Datos locales para la tabla
    const [localEmployeeSchedules, setLocalEmployeeSchedules] = useState([]);

    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchAllEmployeeSchedules());
        }
    }, [dispatch, hasFetchedAll]);

    useEffect(() => {
        if (status === "succeeded") {
            setLocalEmployeeSchedules(employeeSchedules);
        }
    }, [employeeSchedules, status]);


    const handleOpenCreateModal = () => setCreateModalOpen(true);
    const handleCloseModal = () => {
        setCreateModalOpen(false);
        setFormErrors({});
    };

    const handleCreateSubmit = (formData) => {
        console.log("Datos enviados:", formData);
        handleCloseModal();
        showAlert("Empleado asignado correctamente", "success");
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
            {status === "loading" && employeeSchedules.length === 0 && <LoadingIndicator />}
            {status === "failed" && <p>Error al obtener horarios: {error}</p>}

            {/* Solo mostramos la tabla si hay datos */}
            {status === "succeeded" && employeeSchedules.length > 0 && (
                <div className="">
                    <SchedulesTable
                        allColumns={assignmentGeneralColumns}
                        columns={[...assignmentFixedColumns, ...assignmentVisibleColumns]}
                        fixedColumns={assignmentFixedColumns}
                        getCellStyle={getAllCellStyle}
                        data={localEmployeeSchedules}
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
            {employeeSchedules.length === 0 && status !== "loading" && (
                <p>No hay horarios asignados a empleados para mostrar.</p>
            )}

            <ModalForm
                isOpen={isCreateModalOpen}
                setIsOpen={setCreateModalOpen}
                title="Asignar Horario" 
                icon={<RiCalendarScheduleLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
                maxWidth="max-w-lg"
            >
                <AssignEmployeeScheduleForm
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCloseModal}
                    formErrors={formErrors}
                />
            </ModalForm>
        </div>
    );
};

export default schedulesAssignment;
