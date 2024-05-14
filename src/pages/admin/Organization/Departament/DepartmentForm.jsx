import React, { useState, useEffect } from 'react';
import Input from '../../../../components/ui/Input.jsx';
import Textarea from '../../../../components/ui/Textarea.jsx';
import CustomSelect from '../../../../components/ui/Select.jsx';
import { fetchEmployees } from '../../../../redux/Employee/employeSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { validateName } from '../../../../Utils/validationsV2.js';

const NAME_REQUIRED = 'Se requiere el nombre de la dirección.';
const FUNCTION_REQUIRED = 'Indica la función que desempeña la dirección.';
const HEAD_EMPLOYEE_REQUIRED = 'Selecciona un jefe de dirección.';
const FUNCTION_DESCRIPTION_REQUIRED = 'Proporciona una descripción de la función que desempeña la dirección.';

const DepartmentForm = ({
  department,
  isEditing,
  onSubmit,
  onCancel,
  confirmButtonText = isEditing ? 'Guardar cambios' : 'Crear departamento',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = 'bg-blue-500',
  cancelButtonColor = 'border-gray-400',
  formErrors = {}
}) => {
  const dispatch = useDispatch();
  const employeesState = useSelector((state) => state.employee);
  const employees = employeesState ? employeesState.employees : [];
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // Estados locales para manejar los errores y los datos del formulario
  const [formData, setFormData] = useState({ name: '', functionDescription: '', selectedEmployee: null });
  const [errors, setErrors] = useState({ name: '', function: '', head_employee_id: '' });

  // Desestructurar los datos del formulario
  const { name, functionDescription, selectedEmployee } = formData;

  // Efecto para actualizar los errores del formulario
  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  // Efecto para cargar los empleados
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Efecto para cargar los datos del departamento a editar
  useEffect(() => {
    // Encontrar el empleado que es jefe de departamento
    const departmentEmployee = employees.find(employee => employee.id === department?.head_employee_id);

    // Validar los datos del departamento
    if (isEditing && department && employees.length > 0) {
      const nameError = validateName(department.name) || '';
      const functionError = !department.function ? FUNCTION_DESCRIPTION_REQUIRED : '';
      // Actualizar los datos del formulario y los errores
      setFormData({
        name: department.name,
        functionDescription: department.function,
        selectedEmployee: departmentEmployee ? { value: departmentEmployee, label: departmentEmployee.full_name } : null
      });
      // Actualizar los errores
      setErrors({
        name: nameError,
        function: functionError,
        head_employee_id: !departmentEmployee ? HEAD_EMPLOYEE_REQUIRED : ''
      });
    }
  }, [isEditing, department, employees]);

  // Efecto para limpiar los datos del formulario al cancelar la edición
  useEffect(() => {
    if (!isEditing) {
      setFormData({ name: '', functionDescription: '', selectedEmployee: null });
      setErrors({ name: '', function: '', head_employee_id: '' });
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

  // Función para manejar el cambio en el campo de empleado
  const handleEmployeeChange = (option) => {
    setFormData({ ...formData, selectedEmployee: option });
    setErrors((prevErrors) => ({
      ...prevErrors,
      head_employee_id: option ? '' : HEAD_EMPLOYEE_REQUIRED
    }));
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
      head_employee_id: !selectedEmployee ? HEAD_EMPLOYEE_REQUIRED : ''
    };
    // Actualizar los errores
    setErrors(newErrors);
    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (!hasErrors) {
      const headEmployeeId = selectedEmployee ? selectedEmployee.value.id : null;
      // Crear un objeto con los datos actualizados del departamento
      const updatedDepartmentData = { name, function: functionDescription, head_employee_id: headEmployeeId };
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
      <div className='mt-2'>
        <CustomSelect
          label="Jefe de la dirección"
          options={employees}
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          placeholder="Selecciona un empleado"
          error={errors.head_employee_id}
          isSearchable={true}
          labelKey='full_name'
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