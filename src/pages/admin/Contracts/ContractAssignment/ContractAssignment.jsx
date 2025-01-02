import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import {
  fetchAllContractAssignments, createNewContractAssignment, clearErrors,
  renewExistingContractAssignment,
  terminateExistingContractAssignment
} from "../../../../redux/Contracts/contractAssignmentSlince";

import ContractTable from "../Table/ContractTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  contractAssignmentFixedColumns,
  contractAssignmentVisibleColumns,
  contractAssignmentGeneralColumns,
  dynamicFilterColumns
} from "./Table/contractAssignmentColumns";
import { getAllCellStyle } from "./Table/contractAssignmentColumnsStyles";
import renderContractAssignmentActions from "./Table/renderContractAssignmentActions";
import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { LiaFileContractSolid } from "react-icons/lia";
import ContractAssignmentForm from "./components/ContractAssignmentForm";
import ContractTerminateForm from "./components/ContractTerminateForm";
import { IoBan } from "react-icons/io5";


import { LuRefreshCw } from "react-icons/lu";
import { fetchEmployees, fetchActiveEmployees } from "../../../../redux/Employee/employeSlice";

const ContractAssignment = () => {
  const dispatch = useDispatch();
  const { contractAssignments, fetchStatus, error, hasFetchedAll } = useSelector(
    (state) => state.contractAssignments
  );

  const { showAlert } = useContext(AlertContext);

  // Estados
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRenewDialogOpen, setRenewDialogOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [isTerminateModalOpen, setTerminateModalOpen] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);


  const [formErrors, setFormErrors] = useState({});


  // Obtener todos los contratos asignados
  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllContractAssignments());
    }
  }, [dispatch, hasFetchedAll]);

  // Abrir modal para crear un nuevo contrato asignado
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para crear un nuevo contrato asignado
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  }

  // Crear un nuevo contrato asignado y actualizar la tabla
  const handleCreateSubmit = async (data) => {
    setIsCreating(true);
    try {
      await dispatch(createNewContractAssignment(data)).then(unwrapResult);
      handleCloseCreateModal();
      dispatch(fetchEmployees());
      dispatch(fetchActiveEmployees());
      showAlert("Contrato creado exitosamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al crear el contrato", "error");
    } finally {
      setIsCreating(false);
    }
  }



  // Abrir diálogo para renovar el contrato
  const handleOpenRenewDialog = (row) => {
    setCurrentContract(row);
    setRenewDialogOpen(true);
  };

  // Confirmar la renovación del contrato
  const handleConfirmRenew = async () => {
    setIsRenewing(true);
    try {
      await dispatch(renewExistingContractAssignment({ id: currentContract.id })).then(unwrapResult);
      setRenewDialogOpen(false);
      dispatch(fetchEmployees());
      dispatch(fetchActiveEmployees());
      showAlert("Contrato renovado exitosamente", "success");
    } catch (error) {
      showAlert(error.message || "Error al renovar el contrato", "error", 3500);
      setRenewDialogOpen(false);
    } finally {
      setIsRenewing(false);
    }
  };


  // Abrir diálogo para terminar el contrato
  const handleOpenTerminateModal = (row) => {
    setCurrentContract(row);
    setTerminateModalOpen(true);
    setFormErrors({});
    dispatch(clearErrors());
  };

  // Cerrar modal para terminar un contrato asignado
  const handleCloseTerminateModal = () => {
    setTerminateModalOpen(false);
  }

  // Terminar un contrato asignado y actualziar la tabla 
  const handleTerminateSubmit = async (data) => {
    setIsTerminating(true);
    try {
      await dispatch(terminateExistingContractAssignment({ id: currentContract.id, data })).then(unwrapResult);
      dispatch(fetchEmployees());
      dispatch(fetchActiveEmployees());
      showAlert("Contrato terminado exitosamente", "success");
    } catch (error) {
      setFormErrors(error.errors || {});
      showAlert(error.message || "Error al terminar el contrato", "error");
    } finally {
      setIsTerminating(false);
      handleCloseTerminateModal();
    }
  }

  return (
    <div>
      {fetchStatus === "loading" && <LoadingIndicator />}
      {fetchStatus === "failed" && showAlert("Error al cargar los tipos de contrato", "error")}
      {/* Solo Mostramos la tabla si hay datos*/}
      {fetchStatus === "succeeded" && contractAssignments.length > 0 && (
        <ContractTable
          allColumns={contractAssignmentGeneralColumns}
          fixedColumns={contractAssignmentFixedColumns}
          columns={[...contractAssignmentFixedColumns, ...contractAssignmentVisibleColumns]}
          data={contractAssignments}
          getCellStyle={getAllCellStyle}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={true}
          showAddNew={true}
          onAddNew={handleOpenCreateModal}
          actions={(row) => renderContractAssignmentActions({
            row,
            onRenew: handleOpenRenewDialog,
            onTerminate: handleOpenTerminateModal
          })
          }
        />
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}

      {contractAssignments.length === 0 && fetchStatus !== "loading" && (
        <div className="py-10 text-gray-400 text-center">No hay contratos disponibles</div>
      )}

      {/* Modal para crear un nuevo contrato */}
      <ModalForm
        isOpen={isCreateModalOpen}
        setIsOpen={setCreateModalOpen}
        title="Crear contrato"
        icon={<LiaFileContractSolid className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
        onClose={handleCloseCreateModal}
      >
        <ContractAssignmentForm
          onSubmit={handleCreateSubmit}
          onCancel={handleCloseCreateModal}
          isSubmitting={isCreating}
          formErrors={formErrors}
        />
      </ModalForm>

      {/* Modal para terminar contrato */}
      <ModalForm
        isOpen={isTerminateModalOpen}
        setIsOpen={setTerminateModalOpen}
        title="Terminar contrato"
        icon={<IoBan className="w-6 h-6 flex items-center justify-center rounded-full text-red-500" />}
        onClose={handleCloseTerminateModal}
      >
        <ContractTerminateForm
          onSubmit={handleTerminateSubmit}
          onCancel={handleCloseTerminateModal}
          isSubmitting={isTerminating}
          formErrors={formErrors}
        />
      </ModalForm>

      {/* Diálogo de confirmación para renovar contrato */}
      <Dialog2
        isOpen={isRenewDialogOpen}
        setIsOpen={setRenewDialogOpen}
        title="¿Está seguro de renovar este contrato?"
        description="Renovar este contrato creará un nuevo contrato basado en el actual."
        confirmButtonText="Renovar"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmRenew}
        onCancel={() => setRenewDialogOpen(false)}
        isLoading={isRenewing}
        confirmButtonColor="bg-blue-500"
        icon={<LuRefreshCw className="w-10 h-10 flex items-center justify-center rounded-full text-blue-500" />}
      />

    </div>
  )
}

export default ContractAssignment