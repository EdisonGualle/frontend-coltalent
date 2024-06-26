import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiEdit2Line} from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import leaveTypeColumns from './Table/leaveTypeColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import SkeletonTable from '../components/Table/SkeletonTable';
import { fetchLeaveTypes, deleteOneLeaveType, updateOneLeaveType, createNewLeaveType } from '../../../../redux/Leave/leaveTypeSlince';
import LeaveTypeForm from './LeaveTypeForm';
import ModalForm from '../../../../components/ui/ModalForm';
import { FaClipboardList } from "react-icons/fa";
import { getLeaveTypeCellStyle } from './Table/leaveTypeColumnStyles';


const LeaveType = () => {
    const dispatch = useDispatch();
    const { showAlert } = useContext(AlertContext);
    const { leaveTypes, status } = useSelector((state) => state.leaveType);
    const [data, setData] = useState([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  
    // Estado para almacenar los IDs de los registros seleccionados para eliminar
    const [selectedIds, setSelectedIds] = useState([]);
  
    // Estados para manejar el formulario modal de creación y edición
    const [isOpenModalForm, setIsOpenModalForm] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
  
    // Estados para almacenar los datos del tipo de permiso actualmente en edición
    const [currentLeaveType, setCurrentLeaveType] = useState(null);
  
    useEffect(() => {
      dispatch(fetchLeaveTypes())
        .then(unwrapResult)
        .then(() => {
          setIsLoadingInitial(false);
        })
        .catch(() => {
          setIsLoadingInitial(false);
        });
      setFormErrors({});
    }, [dispatch]);
  
    // Actualizar los datos cuando se carguen
    useEffect(() => {
      if (status === 'succeeded') {
        setData(leaveTypes);
      }
    }, [leaveTypes, status]);
  
    const handleCancelDelete = () => setIsOpenDialogDelete(false);
    const handleClickDelete = (ids) => {
      setSelectedIds(ids);
      setIsOpenDialogDelete(true);
    };
  
    const handleConfirmDelete = async () => {
      try {
        for (const leaveTypeId of selectedIds) {
          const resultAction = await dispatch(deleteOneLeaveType(leaveTypeId));
          unwrapResult(resultAction);
        }
        setSelectedIds([]);
        dispatch(fetchLeaveTypes());
        showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
      } catch (error) {
        showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
      } finally {
        setIsOpenDialogDelete(false);
      }
    };
  
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
      const leaveType = leaveTypes.find(type => type.id === row.id);
      if (leaveType) {
        handleOpenEditModalForm(leaveType);
      }
    };
  
    const actions = [
      {
        label: 'Editar',
        icon: <RiEdit2Line className="text-green-600 h-4 w-4" />,
        onClick: handleEdit,
        className: 'bg-green-100 hover:bg-green-200 cursor-pointer',
      }
    ];
  
    return (
      <div>
        <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
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
          {isLoadingInitial ? (
            <SkeletonTable
              columns={leaveTypeColumns}
              showFilters={false}
              showExport={false}
              showAddNew={true}
              showColumnOptions={false}
              actions={actions}
            />
          ) : (
            <LeaveTable
              columns={leaveTypeColumns}
              data={data}
              getCellStyle={getLeaveTypeCellStyle}
              actions={actions}
              onAddNew={handleOpenModalForm}
              showFilters={false}
              showExport={false}
              showAddNew={true}
              showColumnOptions={false}
              showActions={true}
              onDelete={handleClickDelete}
            />
          )}
          <Dialog2
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