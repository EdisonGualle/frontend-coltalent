import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input.jsx';
import Textarea from '../../../../components/ui/Textarea.jsx';
import { validateName } from '../../../../Utils/validationsV2.js';

const NAME_REQUIRED = 'Se requiere el nombre de la dirección.';
const FUNCTION_REQUIRED = 'Indica la función que desempeña la dirección.';
const FUNCTION_DESCRIPTION_REQUIRED = 'Proporciona una descripción de la función que desempeña la dirección.';

const DepartmentForm = ({
  department,
  isEditing,
  onSubmit,
  onCancel,
  confirmButtonText = isEditing ? 'Guardar cambios' : 'Crear Dirección',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = 'bg-blue-500',
  cancelButtonColor = 'border-gray-400',
  formErrors = {}
}) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // Estados locales para manejar los errores y los datos del formulario
  const [formData, setFormData] = useState({ name: '', functionDescription: '' });
  const [errors, setErrors] = useState({ name: '', function: '' });

  // Desestructurar los datos del formulario
  const { name, functionDescription } = formData;

  // Efecto para actualizar los errores del formulario
  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  // Efecto para cargar los datos del departamento a editar
  useEffect(() => {
    // Validar los datos del departamento
    if (isEditing && department) {
      const nameError = validateName(department.name) || '';
      const functionError = !department.function ? FUNCTION_DESCRIPTION_REQUIRED : '';
      // Actualizar los datos del formulario y los errores
      setFormData({
        name: department.name,
        functionDescription: department.function,
      });
      // Actualizar los errores
      setErrors({
        name: nameError,
        function: functionError,
      });
    }
  }, [isEditing, department]);

  // Efecto para limpiar los datos del formulario al cancelar la edición
  useEffect(() => {
    if (!isEditing) {
      setFormData({ name: '', functionDescription: '' });
      setErrors({ name: '', function: '' });
    }
  }, [isEditing]);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const nameError = validateName(value);
      setErrors({ ...errors, name: nameError || '' });
    } else if (name === 'functionDescription') {
      const functionError = !value.trim() ? FUNCTION_DESCRIPTION_REQUIRED : '';
      setErrors({ ...errors, function: functionError });
    }

    setFormData({ ...formData, [name]: value });
  };

  // Efecto para deshabilitar el botón de envío cuando haya errores
  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    setIsSubmitDisabled(hasErrors);
  }, [errors]);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    // Evitar que el formulario recargue la página
    e.preventDefault();
    // Validar si hay errores en los campos
    const newErrors = {
      name: !name ? NAME_REQUIRED : '',
      function: !functionDescription ? FUNCTION_REQUIRED : '',
    };
    // Actualizar los errores
    setErrors(newErrors);
    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (!hasErrors) {
      // Crear un objeto con los datos actualizados del departamento
      const updatedDepartmentData = { name, function: functionDescription };
      // Enviar los datos del departamento al componente padre
      onSubmit(updatedDepartmentData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='mt-2'>
        <Input
          label="Nombre de la dirección"
          id="name"
          placeholder="Ej. Dirección de Recursos Humanos"
          value={name}
          onChange={handleChange}
          error={errors.name}
        />
      </div>
      <div className='mt-2'>
        <Textarea
          label="Función de la dirección"
          id="functionDescription"
          placeholder="Ej. Coordinar las actividades de la dirección de Recursos Humanos."
          value={functionDescription}
          onChange={handleChange}
          error={errors.function}
          rows={3}
        />
      </div>
      <div className="mt-6 flex items-center gap-x-2">
        <button
          type="submit"
          className={`p-2 px-1 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
            ? `${confirmButtonColor} opacity-70 cursor-not-allowed` // Estilos cuando está deshabilitado
            : `${confirmButtonColor}` // Estilos cuando está habilitado
            }`}
          disabled={isSubmitDisabled}
        >
          {confirmButtonText}
        </button>
        <button
          type="button"
          className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105`}
          onClick={onCancel}
        >
          {cancelButtonText}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
