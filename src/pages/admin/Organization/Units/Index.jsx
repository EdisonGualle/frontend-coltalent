import React, { useState, useEffect, useContext } from 'react';
import { RiAddLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import UnitTable from './Table/UnitTable';
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from '../../../../components/ui/ModalForm';
import { AlertContext } from '../../../../contexts/AlertContext';
import UnitForm from './UnitForm';
import { unwrapResult } from '@reduxjs/toolkit';
import { createNewUnit, fetchUnits } from '../../../../redux/Organization/UnitSlince';
import { PiOfficeChairLight } from "react-icons/pi";

const UnitIndex = () => {
  const dispatch = useDispatch();
  // Selector para obtener el estado de las unidades
  const {status} = useSelector(state => state.unit);
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useContext(AlertContext);

  // Efecto para cargar las unidades
  useEffect(() => {
    // Si el estado es idle, se realiza la petición para obtener las unidades
    if (status === 'idle') {
      dispatch(fetchUnits());
    }
  }, [status, dispatch]);

  // Funciones para manejar la apertura y cierre del modal
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (unitData) => {
    try {
      // Despachar la acción para crear una nueva unidad
      const actionResult = await dispatch(createNewUnit(unitData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      handleClose();
      setFormErrors({});
      showAlert('Unidad creada correctamente', 'success');
    } catch (error) {
      // Manejo de errores
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        phone: errors.phone ? errors.phone[0] : '',
        head_employee_id: errors.head_employee_id ? errors.head_employee_id[0] : '',
        department_id: errors.department_id ? errors.department_id[0] : '',
      };
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al crear la unidad', 'error');
      }
    }
  };

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de unidades
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todas las unidades
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colorsrounded-xl py-2 px-5" size="sm"
            onClick={handleOpen}>
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva unidad</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Tabla */}
      <UnitTable/>

      {/* Modal para crear una nueva unidad */}
      <ModalForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Crear nueva unidad"
        icon={<PiOfficeChairLight className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-2xl"
     >
        <UnitForm
          isEditing={false}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default UnitIndex;