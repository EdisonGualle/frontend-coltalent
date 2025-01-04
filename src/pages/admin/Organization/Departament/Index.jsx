import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiAddLine } from "react-icons/ri";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import DepartamentTable from './Table/DepartamentTable';
import ModalForm from '../../../../components/ui/ModalForm';
import { AlertContext } from '../../../../contexts/AlertContext';
import DepartmentForm from './DepartmentForm';
import { createNewDepartment, fetchAllDepartmentsIncludingDeleted } from '../../../../redux/Organization/DepartamentSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import MotionWrapper from '../../../../components/ui/MotionWrapper';

const DepartamentIndex = () => {
  const dispatch = useDispatch();
  // Selector para obtener el estado de los departamentos
  const { status } = useSelector(state => state.departament);
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useContext(AlertContext);

  // Efecto para cargar los departamentos
  useEffect(() => {
    // Si el estado es idle, se realiza la petición para obtener los departamentos
    if (status === 'idle') {
      dispatch(fetchAllDepartmentsIncludingDeleted());
    }
  }, [status, dispatch]);

  // Funciones para manejar la apertura y cierre del modal
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (departmentData) => {
    try {
      // Despachar la acción para crear un nuevo departamento
      const actionResult = await dispatch(createNewDepartment(departmentData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      handleClose();
      setFormErrors({});
      showAlert('Dirección creada correctamente', 'success');
    } catch (error) {
      // Manejo de errores
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};
      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        head_employee_id: errors.head_employee_id ? errors.head_employee_id[0] : '',
      };
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al actualizar la dirección', 'error');
      }
    }
  };


  return (
    <div className='flex flex-col h-full overflow-auto'>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de direcciones
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todas las direcciones.
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-xl py-2 px-5" size="sm"
              onClick={handleOpen}>
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva Dirección</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Tabla*/}
      <div className='flex-1 overflow-y-auto'>
        <MotionWrapper keyProp="department-table">
          <DepartamentTable />
        </MotionWrapper>
      </div>
      {/* Formulario */}
      <ModalForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Crear nueva dirección"
        icon={<HiOutlineOfficeBuilding className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <DepartmentForm
          isEditing={false}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default DepartamentIndex;