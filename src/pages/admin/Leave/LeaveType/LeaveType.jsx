import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import leaveTypeColumns from './Table/leaveTypeColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import {
  fetchLeaveTypes,
  updateOneLeaveType, createNewLeaveType,
  fetchAllLeaveTypesIncludingDeleted, toggleOneLeaveTypeStatus
} from '../../../../redux/Leave/leaveTypeSlince';
import LeaveTypeForm from './LeaveTypeForm';
import ModalForm from '../../../../components/ui/ModalForm';
import { FaClipboardList } from "react-icons/fa";
import { getLeaveTypeCellStyle } from './Table/leaveTypeColumnStyles';
import LoadingIndicator from '../../../../components/ui/LoadingIndicator';
import LeaveTable from '../Table/LeaveTable';
import renderLeaveTypeActions from './Table/renderLeaveTypeActions';
import MotionWrapper from '../../../../components/ui/MotionWrapper';

const LeaveType = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const { fetchAllStatus, allLeaveTypes, hasFetchedAllIncludingDeleted } = useSelector((state) => state.leaveType);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos del tipo de permiso actualmente en edición
  const [currentLeaveType, setCurrentLeaveType] = useState(null);


  useEffect(() => {
    if (!hasFetchedAllIncludingDeleted) {
      dispatch(fetchAllLeaveTypesIncludingDeleted());
    }
  }, [dispatch, hasFetchedAllIncludingDeleted]);


  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentLeaveType(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModalForm = (leaveType) => {
    setIsEditing(true);
    setCurrentLeaveType(leaveType);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  const handleSubmit = async (formData) => {
    try {
      if (isEditing && currentLeaveType) {
        const updatedLeaveTypeData = {
          leaveTypeId: currentLeaveType.id,
          updateLeaveType: formData,
        };

        const resultAction = await dispatch(updateOneLeaveType(updatedLeaveTypeData));
        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchLeaveTypes());
      } else {
        const resultAction = await dispatch(createNewLeaveType(formData));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        description: errors.description ? errors.description[0] : '',
        max_duration: errors.max_duration ? errors.max_duration[0] : '',
        time_unit: errors.time_unit ? errors.time_unit[0] : '',
        requires_document: errors.requires_document ? errors.requires_document[0] : '',
        advance_notice_days: errors.advance_notice_days ? errors.advance_notice_days[0] : '',
        flow_type: errors.flow_type ? errors.flow_type[0] : '',
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
    const leaveType = allLeaveTypes.find(type => type.id === row.id);
    if (leaveType) {
      handleOpenEditModalForm(leaveType);
    }
  };

  const handleToggleClick = (row) => {
    setSelectedReason(row);
    setIsOpenToggleDialog(true);
  };

  const handleConfirmToggle = async () => {
    try {
      const resultAction = await dispatch(toggleOneLeaveTypeStatus(selectedReason.id));
      unwrapResult(resultAction);
      showAlert('Estado del tipo de permiso actualizado correctamente', 'success');
      dispatch(fetchAllLeaveTypesIncludingDeleted());
    } catch (error) {
      showAlert('Error al actualizar el estado del tipo de permiso.', 'error');
    } finally {
      setIsOpenToggleDialog(false);
    }
  };

  const handleCancelToggle = () => setIsOpenToggleDialog(false);

  const getToggleMessage = (status) => {
    if (status === 'Activo') {
      return {
        title: '¿Desactivar tipo de permiso?',
        description: 'Desactivar este tipo de permiso puede afectar los procesos asociados. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, desactivar',
        confirmButtonColor: 'bg-yellow-500',
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
      };
    } else {
      return {
        title: '¿Activar tipo de permiso?',
        description: 'Activar este tipo de permiso permitirá que los procesos asociados puedan utilizarlo nuevamente. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, activar',
        confirmButtonColor: 'bg-green-500',
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
      };
    }
  };

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Tipos de permisos
            </Typography>
            <Typography color="gray" className="mt-1">
              Lista de tipos de permisos disponibles.
            </Typography>
          </div>
        </div>
      </CardHeader>

      <MotionWrapper keyProp="leave-type-management">
        {fetchAllStatus === "loading" && allLeaveTypes.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <LeaveTable
            columns={leaveTypeColumns}
            getCellStyle={getLeaveTypeCellStyle}
            data={allLeaveTypes}
            showAddNew={true}
            showFilters={false}
            showColumnOptions={false}
            onAddNew={handleOpenModalForm}
            showActions={true}
            actions={(row) =>
              renderLeaveTypeActions({
                row,
                onEdit: handleEdit, // Pasar la función de editar
                onToggleStatus: () => handleToggleClick(row), // Pasar la función de toggle
              })
            }
          />
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
        title={isEditing ? 'Editar tipo de permiso' : 'Agregar nuevo tipo de permiso'}
        icon={<FaClipboardList className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-lg'
      >
        <LeaveTypeForm
          leaveType={currentLeaveType}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default LeaveType;