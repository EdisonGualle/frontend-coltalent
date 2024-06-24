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
  const {status} = useSelector(state => state.unit);
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUnits());
    }
  }, [status, dispatch]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (unitData) => {
    try {
      const actionResult = await dispatch(createNewUnit(unitData));
      unwrapResult(actionResult);
      handleClose();
      setFormErrors({});
      showAlert('Unidad creada correctamente', 'success');
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        phone: errors.phone ? errors.phone[0] : '',
        direction_id: errors.direction_id ? errors.direction_id[0] : ''
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
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de unidades
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver información sobre todas las unidades
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-xl py-2 px-5" size="sm"
            onClick={handleOpen}>
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva unidad</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <UnitTable/>

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
