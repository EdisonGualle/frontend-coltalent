import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllOvertimeWorks, createOvertime, clearErrors, deleteOvertime } from "../../../redux/Overtime/overtimeSlince";
import { CardHeader, Typography } from "@material-tailwind/react";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import LoadingIndicator from "../../../components/ui/LoadingIndicator";
import OvertimeTable from "./Table/OvertimeTable";
import {
    overtimeFixedColumns,
    overtimeVisibleColumns,
    overtimeGeneralColumns,
    dynamicFilterColumns
} from "./Table/overtimeColumns";
import { AlertContext } from "../../../contexts/AlertContext";
import ModalForm from "../../../components/ui/ModalForm";
import Dialog2 from "../../../components/ui/Dialog2";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { FiClipboard } from "react-icons/fi";

import { getAllCellStyle } from "./Table/overtimeColumnsStyles";
import FormOverTime from "./components/FormOverTime";

const Overtime = () => {
    const dispatch = useDispatch();
    const { overtimeWorks, fetchStatus, error, hasFetchedAll } = useSelector(
        (state) => state.overtime
    );

    const { showAlert } = useContext(AlertContext);

    // Estados
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);


    // Obtener todos los registros de trabajo en días festivos, descanso u horas extra
    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchAllOvertimeWorks());
        }
    }, [dispatch, hasFetchedAll]);

    // Abrir modal para crear un nuevo registro de trabajo en días festivos, descanso u horas extra
    const handleOpenCreateModal = () => {
        setCreateModalOpen(true);
        setFormErrors({});
        dispatch(clearErrors());
    };

    // Cerrar modal para crear un nuevo registro de trabajo en días festivos, descanso u horas extra
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    };

    // Crear un nuevo registro de trabajo en días festivos, descanso u horas extra y actualizar la tabla automaticamnte
    const handleCreatesubmit = async (formData) => {
        setIsCreating(true);
        try {
            await dispatch(createOvertime({ overtimeData: formData })).then(unwrapResult);
            handleCloseCreateModal();
            showAlert("El registro de trabajo se ha creado correctamente", "success");
        } catch (error) {
            setFormErrors(error.errors || {});
            showAlert(error.message || "Error al crear el día festivo", "error", 4000);
        } finally {
            setIsCreating(false);
        }
    }

    // Abrir diálogo de confirmación de eliminación
    const handleClickDelete = (ids) => {
        setSelectedIds(ids);
        setIsOpenDialogDelete(true);
    };

    // Cancelar la eliminación
    const handleCancelDelete = () => setIsOpenDialogDelete(false);

    // Eliminar registros de trabajo en días festivos, descanso u horas extra
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await dispatch(deleteOvertime({ data: selectedIds })).then(unwrapResult);
            showAlert(result?.msg || "Registros eliminados correctamente", "success", 3000);
        } catch (error) {
            showAlert(error.message || "Error al eliminar los registros", "error");
        } finally {
            setIsDeleting(false);
            setIsOpenDialogDelete(false);
        }
    };

    return (
        <div>
            {/* Card Header */}
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                            Gestión de Turnos Especiales
                        </Typography>
                        <Typography color="gray" className="mt-1">
                            Gestiona las horas extras, trabajos en días festivos y turnos especiales.
                        </Typography>
                    </div>
                </div>
            </CardHeader>

            {fetchStatus === "loading" && <LoadingIndicator />}
            {fetchStatus === "failed" && showAlert("Error al cargar los turnos especiales", "error")}

            {/* Content wrapped with MotionWrapper */}
            <MotionWrapper keyProp="overtime-management">

                {/* Solo mostramos la tabla si hay datos cargados */}
                {fetchStatus === "succeeded" && overtimeWorks.length > 0 && (
                    <OvertimeTable
                        allColumns={overtimeGeneralColumns}
                        columns={[...overtimeVisibleColumns, ...overtimeFixedColumns]}
                        fixedColumns={overtimeFixedColumns}
                        data={overtimeWorks}
                        getCellStyle={getAllCellStyle}
                        dynamicFilterColumns={dynamicFilterColumns}
                        showActions={false}
                        showFilters={true}
                        showAddNew={true}
                        onAddNew={handleOpenCreateModal}
                        onDelete={handleClickDelete}
                    />
                )}

                {/* Mostrar un mensaje si no hay datos */}
                {overtimeWorks.length === 0 && fetchStatus === "succeeded" && (
                    <div className="py-10 text-gray-400 text-center">No hay turnos especiales disponibles</div>
                )}
            </MotionWrapper>

            {/* Modal para crar un nuevo  dia festivo */}
            <ModalForm
                isOpen={isCreateModalOpen}
                setIsOpen={setCreateModalOpen}
                title="Crear Turno Especial"
                icon={<FiClipboard className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
            >
                <FormOverTime
                    onSubmit={handleCreatesubmit}
                    onCancel={handleCloseCreateModal}
                    formErrors={formErrors}
                    isSubmitting={isCreating}
                />
            </ModalForm>

            {/* Diálogo de confirmación para eliminar registros */}
            <Dialog2
                isOpen={isOpenDialogDelete}
                setIsOpen={setIsOpenDialogDelete}
                title={`¿Eliminar ${selectedIds.length > 1 ? "los turnos seleccionados" : "el turno seleccionado"}?`}
                description={`¿Estás seguro de que deseas eliminar ${selectedIds.length > 1 ? "estos turnos" : "este turno"}? Esta acción es permanente y no se podrá deshacer.`}
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmButtonColor="bg-red-500"
                cancelButtonColor="border-gray-400"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Overtime;