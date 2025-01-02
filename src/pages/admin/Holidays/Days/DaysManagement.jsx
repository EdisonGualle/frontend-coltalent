import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllHolidays, createNewHoliday, clearErrors, updateExistingHoliday, deleteExistingHoliday } from "../../../../redux/Holidays/holidaysSlince";
import HolidaysTable from "../Table/HolidaysTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
    daysFixedColumns,
    daysVisibleColumns,
    daysGeneralColumns,
    dynamicFilterColumns
} from "./Table/daysColumns";
import { getAllCellStyle } from "./Table/DaysColumnsStyles";
import renderDaysActions from "./Table/renderDaysActions";
import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { LiaCalendarDaySolid } from "react-icons/lia";
import DayForm from "./components/DayForm";



const DaysManagement = () => {
    const dispatch = useDispatch();
    const { holidays, fetchStatus, error, hasFetchedAll } = useSelector(
        (state) => state.holidays
    );

    const { showAlert } = useContext(AlertContext);

    // Estados
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formErrors, setFormErrors] = useState({});



    // Obtener todos los días festivos
    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchAllHolidays());
        }
    }, [dispatch, hasFetchedAll]);

    // Abrir modal para crear un nuevo día festivo
    const handleOpenCreateModal = () => {
        setCreateModalOpen(true);
        setFormErrors({});
        dispatch(clearErrors());
    };

    // Cerrar modal para crear un nuevo día festivo
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    };

    // Crear un nuevo día festivo y actualizar la tabla automaticamente mediante Redux
    const handleCreateSubmit = async (dayData) => {
        setIsCreating(true);
        try {
            await dispatch(createNewHoliday(dayData)).then(unwrapResult);
            handleCloseCreateModal();
            showAlert("Día festivo creado correctamente", "success");
        } catch (error) {
            setFormErrors(error.errors || {});
            showAlert(error.message || "Error al crear el día festivo", "error");
        } finally {
            setIsCreating(false);
        }
    };

    // Abrir modal para editar un día festivo
    const handleOpenEditModal = (row) => {
        setCurrentDay(row);
        setEditModalOpen(true);
        setFormErrors({});
        dispatch(clearErrors());
    };

    // Cerrar modal para editar un día festivo
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    // Editar un día festivo y actualizar la tabla automaticamente mediante Redux
    const handleEditSubmit = async (dayData) => {
        setIsEditing(true);
        try {
            await dispatch(updateExistingHoliday({ id: currentDay.id, holidayData: dayData })).then(unwrapResult);
            handleCloseEditModal();
            showAlert("Día festivo actualizado correctamente", "success");
        } catch (error) {
            setFormErrors(error.errors || {});
            showAlert(error.message || "Error al actualizar el día festivo", "error");
        } finally {
            setIsEditing(false);
        }
    };

    // Abrir diálogo para confirmar eliminación
    const handleOpenDeleteDialog = (row) => {
        setCurrentDay(row);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar y procesar la eliminación
    const handleConfirmDelete = async () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(true);
        try {
            await dispatch(deleteExistingHoliday(currentDay.id)).then(unwrapResult);
            showAlert("Día festivo eliminado correctamente", "success");
        } catch (error) {

            showAlert(error.message || "Error al eliminar el día festivo", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {fetchStatus === "loading" && <LoadingIndicator />}
            {fetchStatus === "failed" && showAlert("Error al cargar los días festivos ", "error")}

            {/* Solo Mostramos la tabla si hay datos*/}
            {fetchStatus === "succeeded" && holidays.length > 0 && (
                <HolidaysTable
                    allColumns={daysGeneralColumns}
                    columns={[...daysFixedColumns, ...daysVisibleColumns]}
                    fixedColumns={daysFixedColumns}
                    data={holidays}
                    getCellStyle={getAllCellStyle}
                    dynamicFilterColumns={dynamicFilterColumns}
                    showActions={true}
                    showAddNew={true}
                    onAddNew={handleOpenCreateModal}
                    actions={(row) => renderDaysActions({
                        row,
                        onEdit: handleOpenEditModal,
                        onDelete: () => handleOpenDeleteDialog(row),
                    })
                    }
                />
            )}

            {/* Si no hay datos disponibles, mostar mensaje */}
            {holidays.length === 0 && fetchStatus !== "loading" && (
                <div className="py-10 text-gray-400 text-center">No hay días festivos disponibles</div>
            )}

              {/* Diálogo para confirmar eliminación */}
              <Dialog2
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                title="¿Está seguro de eliminar este día festivo?"
                description={`Eliminar este día festivo (${currentDay?.name}) es una acción irreversible.`}
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
                isLoading={isDeleting}
                confirmButtonColor="bg-red-500"
                icon={<RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />}
            />

            {/* Modal para crar un nuevo  dia festivo */}
            <ModalForm
                isOpen={isCreateModalOpen}
                setIsOpen={setCreateModalOpen}
                title="Crear día festivo"
                icon={<LiaCalendarDaySolid className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
            >
                <DayForm
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCloseCreateModal}
                    formErrors={formErrors}
                    isSubmitting={isCreating}
                />
            </ModalForm>

            {/* Modal para editar un día festivo */}
            <ModalForm
                isOpen={isEditModalOpen}
                setIsOpen={setEditModalOpen}
                title="Editar día festivo"
                icon={<LiaCalendarDaySolid className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
            >
                <DayForm
                    isEditing={true}
                    initialData={currentDay}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCloseEditModal}
                    formErrors={formErrors}
                    isSubmitting={isEditing}
                />
            </ModalForm>

        </>
    )
}

export default DaysManagement