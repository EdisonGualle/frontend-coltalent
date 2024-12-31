import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllContractTypes, createContract, clearErrors, updateContract, deleteContract, restoreContract } from "../../../../redux/Contracts/contractTypeSlince";
import ContractTable from "../Table/ContractTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  contractTypesFixedColumns,
  contractTypesVisibleColumns,
  contractTypesGeneralColumns,
  dynamicFilterColumns
} from "./Table/contractTypesColumns";
import { getAllCellStyle } from "./Table/contractTypesColumnsStyles";
import renderContractTypeActions from "./Table/renderContractTypeActions";
import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { LiaFileContractSolid } from "react-icons/lia";

import ContractTypeForm from "./components/ContractTypeForm";

const ContractTypes = () => {
  const dispatch = useDispatch();
  const { contractTypes, fetchStatus, error, hasFetchedAll } = useSelector(
    (state) => state.contractTypes
  );

  const { showAlert } = useContext(AlertContext);

  // Estados
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContractType, setCurrentContractType] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [statusDialogMessage, setStatusDialogMessage] = useState({});


  const [formErrors, setFormErrors] = useState({});


  // Obtener todos los tipos de contrato
  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllContractTypes());
    }
  }, [dispatch, hasFetchedAll]);

  // Abrir modal para crear un nuevo tipo de contrato
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para crear un nuevo tipo de contrato
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Crear un nuevo tipo de contrato y actualizar la tabla automaticamente mediante Redux
  const handleCreateSubmit = async (contractTypeData) => {
    setIsCreating(true);
    try {
      await dispatch(createContract(contractTypeData)).then(unwrapResult);
      handleCloseCreateModal();
      showAlert("Tipo de contrato creado exitosamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al crear el tipo de contrato", "error");
    } finally {
      setIsCreating(false);
    }
  };

  // Abrir modal para editar un tipo de contrato
  const handleOpenEditModal = (row) => {
    setCurrentContractType(row);
    setEditModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para editar un tipo de contrato
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Editar un tipo de contrato y actualizar la tabla automaticamente mediante Redux
  const handleEditSubmit = async (contractTypeData) => {
    setIsEditing(true);
    try {
      await dispatch(updateContract({ id: currentContractType.id, contractTypeData })).then(unwrapResult);
      handleCloseEditModal();
      showAlert("Tipo de contrato actualizado exitosamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al actualizar el tipo de contrato", "error");
    } finally {
      setIsEditing(false);
    }
  };

  // Abrir dialogo para cambiar el estado de un tipo de contrato
  const handleToggleStatus = (row) => {
    setCurrentContractType(row);
    setStatusDialogMessage(getStatusDialogMessage(row.status));
    setIsStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    setIsStatusDialogOpen(false);
    setIsChangingStatus(true);
    try {
      if (currentContractType.status === "Activo") {
        await dispatch(deleteContract(currentContractType.id)).then(unwrapResult);
        showAlert("Tipo de contrato desactivado correctamente", "success");
      } else {
        await dispatch(restoreContract(currentContractType.id)).then(unwrapResult);
        showAlert("Tipo de contrato activado correctamente", "success");
      }
    } catch (error) {
      console.log(error);
      showAlert(error.message || "Error al realizar la acción", "error");
    } finally {
      setIsChangingStatus(false);
    }
  };


  // Personalizar el mensaje del diálogo
  const getStatusDialogMessage = (status) => {
    return status === "Activo"
      ? {
        title: "¿Está seguro de desactivar este tipo de contrato?",
        description: "Desactivar este tipo de contrato puede interrumpir tareas relacionadas. Esta acción es reversible.",
        confirmButtonText: "Desactivar",
        confirmButtonColor: "bg-yellow-500",
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />,
      }
      : {
        title: "¿Está seguro de activar este tipo de contrato?",
        description: "Activar este tipo de contrato permitirá su uso en los procesos relacionados. Esta acción es reversible.",
        confirmButtonText: "Activar",
        confirmButtonColor: "bg-green-500",
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />,
      };
  };


  return (
    <div>
      {fetchStatus === "loading" && <LoadingIndicator />}
      {fetchStatus === "failed" && showAlert("Error al cargar los tipos de contrato", "error")}

      {/* Solo Mostramos la tabla si hay datos*/}
      {fetchStatus === "succeeded" && contractTypes.length > 0 && (
        <ContractTable
          allColumns={contractTypesGeneralColumns}
          columns={[...contractTypesFixedColumns, ...contractTypesVisibleColumns]}
          fixedColumns={contractTypesFixedColumns}
          data={contractTypes}
          getCellStyle={getAllCellStyle}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={true}
          showAddNew={true}
          onAddNew={handleOpenCreateModal}
          actions={(row) =>
            renderContractTypeActions({
              row,
              onEdit: handleOpenEditModal,
              onToggleStatus: () => handleToggleStatus(row),
            })
          }
        />
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}
      {contractTypes.length === 0 && fetchStatus !== "loading" && (
        <div className="py-10 text-gray-400 text-center">No hay tipos de contrato disponibles</div>
      )}

      {/*Diálogo de confirmación para cambiar el estado del tipode estado */}
      <Dialog2
        isOpen={isStatusDialogOpen}
        setIsOpen={setIsStatusDialogOpen}
        title={statusDialogMessage.title}
        description={statusDialogMessage.description}
        confirmButtonText={statusDialogMessage.confirmButtonText}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setIsStatusDialogOpen(false)}
        isLoading={isChangingStatus}
        confirmButtonColor={statusDialogMessage.confirmButtonColor}
        icon={statusDialogMessage.icon} // Aquí se pasa el ícono generado
      />



      {/* Modal para crear un nuevo tipo de contrato */}
      <ModalForm
        isOpen={isCreateModalOpen}
        setIsOpen={setCreateModalOpen}
        title="Crear tipo de contrato"
        icon={<LiaFileContractSolid className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-2xl"
      >
        <ContractTypeForm
          isEditing={false}
          onSubmit={handleCreateSubmit}
          onCancel={handleCloseCreateModal}
          formErrors={formErrors}
          isSubmitting={isCreating}
        />
      </ModalForm>

      {/* Modal para editar un tipo de contrato */}
      <ModalForm
        isOpen={isEditModalOpen}
        setIsOpen={setEditModalOpen}
        title="Editar tipo de contrato"
        icon={<LiaFileContractSolid className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-2xl"
      >
        <ContractTypeForm
          isEditing={true}
          initialData={currentContractType}
          onSubmit={handleEditSubmit}
          onCancel={handleCloseEditModal}
          formErrors={formErrors}
          isSubmitting={isEditing}
        />
      </ModalForm>
    </div>
  )
}

export default ContractTypes