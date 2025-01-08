import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiEdit2Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import leaveTypeColumns from './Table/leaveTypeColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import SkeletonTable from '../components/Table/SkeletonTable';
import {
  fetchLeaveTypes, deleteOneLeaveType,
  updateOneLeaveType, createNewLeaveType,
  fetchAllLeaveTypesIncludingDeleted, toggleOneLeaveTypeStatus
} from '../../../../redux/Leave/leaveTypeSlince';
import LeaveTypeForm from './LeaveTypeForm';
import ModalForm from '../../../../components/ui/ModalForm';
import { FaClipboardList } from "react-icons/fa";
import { getLeaveTypeCellStyle } from './Table/leaveTypeColumnStyles';

import LoadingIndicator from '../../../../components/ui/LoadingIndicator';

const LeaveType = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const { status, hasFetchedOnce, allLeaveTypes } = useSelector((state) => state.leaveType);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos del tipo de permiso actualmente en edición
  const [currentLeaveType, setCurrentLeaveType] = useState(null);

  useEffect(() => {
    if (!hasFetchedOnce) {  // Solo cargar datos si no se han cargado previamente
      setIsLoadingInitial(true); // Asegúrate de iniciar la carga
      dispatch(fetchAllLeaveTypesIncludingDeleted())
        .then(unwrapResult)
        .then(() => {
          setIsLoadingInitial(false); // Desactivar la carga inicial después de cargar datos
        })
        .catch(error => {
          setIsLoadingInitial(false); // Asegurarse de desactivar la carga en caso de error
        });
    } else {
      setIsLoadingInitial(false); // Asegúrate de desactivar la carga si los datos ya están disponibles
    }
  }, [dispatch, hasFetchedOnce]);


  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded') {
      setData(allLeaveTypes);
    }
  }, [allLeaveTypes, status]);

  // const handleCancelDelete = () => setIsOpenDialogDelete(false);
  // const handleClickDelete = (ids) => {
  //   setSelectedIds(ids);
  //   setIsOpenDialogDelete(true);
  // };

  // const handleConfirmDelete = async () => {
  //   try {
  //     for (const leaveTypeId of selectedIds) {
  //       const resultAction = await dispatch(deleteOneLeaveType(leaveTypeId));
  //       unwrapResult(resultAction);
  //     }
  //     setSelectedIds([]);
  //     dispatch(fetchLeaveTypes());
  //     showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
  //   } catch (error) {
  //     showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
  //   } finally {
  //     setIsOpenDialogDelete(false);
  //   }
  // };

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
    console.log('formData', formData);
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

  const renderActions = (row) => [
    {
      label: 'Editar',
      icon: <RiEdit2Line className="text-green-700 h-4 w-4" />,
      onClick: () => handleEdit(row),
      className: 'bg-green-100 hover:bg-green-200 cursor-pointer',
    },
    {
      label: row.status === 'Activo' ? 'Desactivar' : 'Activar',
      icon: row.status === 'Activo' ? <RiCloseCircleLine className="text-yellow-700 h-4 w-4" /> : <RiCheckboxCircleLine className="text-green-700 h-4 w-4" />,
      onClick: () => handleToggleClick(row),
      className: row.status === 'Activo' ? 'bg-yellow-100 hover:bg-yellow-200 cursor-pointer' : 'bg-green-100 hover:bg-green-200 cursor-pointer',
    }
  ];



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

      <div className=''>
        {isLoadingInitial && !allLeaveTypes.length ? (
          <LoadingIndicator/>
        ) : (
          <LeaveTable
            columns={leaveTypeColumns}
            data={data}
            getCellStyle={getLeaveTypeCellStyle}
            actions={renderActions}
            onAddNew={handleOpenModalForm}
            showFilters={false}
            showExport={false}
            showAddNew={true}
            showColumnOptions={false}
            showActions={true}
            onDelete={null}
          />
        )}
        {/* <Dialog2
            isOpen={isOpenDialogDelete}
            setIsOpen={setIsOpenDialogDelete}
            title={`¿Eliminar ${selectedIds.length > 1 ? 'los registros seleccionados' : 'el registro seleccionado'}?`}
            description={`¿Estás seguro de que deseas eliminar ${selectedIds.length > 1 ? 'estos registros' : 'este registro'}? Esta acción es permanente y no se podrá deshacer.`}
            confirmButtonText="Sí, eliminar"
            cancelButtonText="Cancelar"
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            confirmButtonColor="bg-red-500"
            cancelButtonColor="border-gray-400"
          /> */}

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
    </div>
  );
};

export default LeaveType;