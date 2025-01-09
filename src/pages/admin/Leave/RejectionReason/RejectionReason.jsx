import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import rejectionReasonColumns from './Table/rejectionReasonColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import {
  fetchRejectionReasons,
  updateOneRejectionReason, createNewRejectionReason,
  fetchAllRejectionReasonsIncludingDeleted, toggleOneRejectionReasonStatus
} from '../../../../redux/Leave/rejectionReasonSlince';
import ModalForm from '../../../../components/ui/ModalForm';
import { TbMessageX } from "react-icons/tb";
import RejectionReasonForm from './RejectionReasonForm';
import { getCellStyle } from './Table/getCellStyle';
import LoadingIndicator from '../../../../components/ui/LoadingIndicator';
import renderRejectionReasonActions from './Table/renderRejectionReasonActions';
import LeaveTable from '../Table/LeaveTable';
import MotionWrapper from '../../../../components/ui/MotionWrapper';

const RejectionReason = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const { fetchAllStatus, allRejectionReasons, hasFetchedAllIncludingDeleted } = useSelector((state) => state.rejectionReason);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos del motivo de rechazo actualmente en edición
  const [currentRejectionReason, setCurrentRejectionReason] = useState(null);

  useEffect(() => {
    if (!hasFetchedAllIncludingDeleted) {
      dispatch(fetchAllRejectionReasonsIncludingDeleted());
    }
  }, [dispatch, hasFetchedAllIncludingDeleted]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentRejectionReason(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModalForm = (rejectionReason) => {
    setIsEditing(true);
    setCurrentRejectionReason(rejectionReason);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (formData) => {
    try {
      if (isEditing && currentRejectionReason) {
        const { reason, leave_type_ids } = formData;

        const updatedRejectionReasonData = {
          rejectionReasonId: currentRejectionReason.id,
          updateRejectionReason: {
            reason,
            leave_type_ids, // Asegúrate de incluir los IDs aquí
          },
        };
        const resultAction = await dispatch(updateOneRejectionReason(updatedRejectionReasonData));
        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchRejectionReasons());
      } else {
        const resultAction = await dispatch(createNewRejectionReason(formData));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        reason: errors.reason ? errors.reason[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }
    }
  };

  const handleEdit = (row) => {
    const rejectionReason = allRejectionReasons.find(reason => reason.id === row.id);
    if (rejectionReason) {
      handleOpenEditModalForm(rejectionReason);
    }
  };


  const handleToggleClick = (row) => {
    setSelectedReason(row);
    setIsOpenToggleDialog(true);
  };


  const handleConfirmToggle = async () => {
    try {
      const resultAction = await dispatch(toggleOneRejectionReasonStatus(selectedReason.id));
      unwrapResult(resultAction);
      showAlert('Estado del motivo de rechazo actualizado correctamente', 'success');
      dispatch(fetchAllRejectionReasonsIncludingDeleted());
    } catch (error) {
      showAlert('Error al actualizar el estado del motivo de rechazo.', 'error');
    } finally {
      setIsOpenToggleDialog(false);
    }
  };

  const handleCancelToggle = () => setIsOpenToggleDialog(false);

  const getToggleMessage = (status) => {
    if (status === 'Activo') {
      return {
        title: '¿Desactivar motivo de rechazo?',
        description: 'Desactivar este motivo de rechazo puede afectar los procesos asociados. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, desactivar',
        confirmButtonColor: 'bg-yellow-500',
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
      };
    } else {
      return {
        title: '¿Activar motivo de rechazo?',
        description: 'Activar este motivo de rechazo permitirá que los procesos asociados puedan utilizarlo nuevamente. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, activar',
        confirmButtonColor: 'bg-green-500',
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
      };
    }
  };

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100 " >
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Motivos de rechazo
            </Typography>
            <Typography color="gray" className="mt-1">
              Lista de motivos de rechazo de solicitudes de permisos.
            </Typography>
          </div>
        </div>
      </CardHeader>

      <MotionWrapper keyProp="rejection-reasons-management">
        {fetchAllStatus === 'loading' && allRejectionReasons.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <div>
            <LeaveTable
              columns={rejectionReasonColumns}
              getCellStyle={getCellStyle}
              data={allRejectionReasons}
              showAddNew={true}
              showFilters={false}
              showColumnOptions={false}
              onAddNew={handleOpenModalForm}
              showActions={true}
              actions={(row) =>
                renderRejectionReasonActions({
                  row,
                  onEdit: handleEdit, // Pasar la función de editar
                  onToggleStatus: () => handleToggleClick(row), // Pasar la función de toggle
                })
              }
            />
          </div>
        )}
      </MotionWrapper>

      <Dialog2
        isOpen={isOpenToggleDialog}
        setIsOpen={setIsOpenToggleDialog}
        title={getToggleMessage(selectedReason?.status).title}
        description={getToggleMessage(selectedReason?.status).description}
        confirmButtonText={getToggleMessage(selectedReason?.status).confirmButtonText}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelToggle}
        confirmButtonColor={getToggleMessage(selectedReason?.status).confirmButtonColor}
        cancelButtonColor="border-gray-400"
        icon={getToggleMessage(selectedReason?.status).icon}
      />
      
      <ModalForm
        isOpen={isOpenModalForm}
        setIsOpen={setIsOpenModalForm}
        title={isEditing ? 'Editar motivo de rechazo' : 'Agregar nuevo motivo de rechazo'}
        icon={<TbMessageX className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <RejectionReasonForm
          rejectionReason={currentRejectionReason}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default RejectionReason;
