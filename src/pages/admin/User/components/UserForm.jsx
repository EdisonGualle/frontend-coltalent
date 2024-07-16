import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../components/ui/Input';
import { RiUserLine, RiMailLine } from 'react-icons/ri';
import { validateUsername, validateEmail } from '../../../../Utils/validationsV2.js';
import CustomSelect from '../../../../components/ui/Select.jsx';
import { fetchRoles } from '../../../../redux/User/rolSlice.js';
import { fetchUserStates } from '../../../../redux/User/userStateSlice.js';
import { fetchEmployees } from '../../../../redux/Employee/employeSlice.js';

// Componente para el formulario de creación y edición de usuarios
const UserForm = ({
  user,               // Usuario a editar
  isEditing,          // Indica si se está editando un usuario
  onSubmit,           // Función para enviar el formulario
  onCancel,           // Función para cancelar la edición
  confirmButtonText = isEditing ? 'Guardar cambios' : 'Crear usuario',  // Texto del botón de confirmación
  cancelButtonText = 'Cancelar',         // Texto del botón de cancelación
  confirmButtonColor = 'bg-blue-500',    // Color del botón de confirmación
  cancelButtonColor = 'border-gray-400', // Color del botón de cancelación
  formErrors = {}      // Errores del formulario
}) => {
  // Hooks de Redux para despachar acciones 
  const dispatch = useDispatch();
  // Obtener los roles, estados de usuario y empleados del estado global
  const rolesState = useSelector((state) => state.role);
  const roles = rolesState ? rolesState.roles : [];
  const userStatesState = useSelector((state) => state.userState);
  const userStates = userStatesState ? userStatesState.userStates : [];
  const employeesState = useSelector((state) => state.employee);
  const employees = employeesState ? employeesState.employees : [];

  // Estados locales para manejar los errores y los datos del formulario
  const [errors, setErrors] = useState({ name: '', email: '', role: '', role_id: '', state: '', state_id: '', employee: '', employee_id: '' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserState, setSelectedUserState] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  // Efecto para actualizar los errores del formulario
  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  // Efecto para cargar los roles, estados de usuario y empleados
  useEffect(() => {
    // Despachar las acciones para cargar los roles, estados de usuario y empleados
    dispatch(fetchRoles());
    dispatch(fetchUserStates());
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Efecto para cargar los datos del usuario a editar
  useEffect(() => {
    const userRole = roles.find(role => role.id === user?.role?.id);
    const userState = userStates.find(state => state.id === user?.user_state?.id);
    const userEmployee = employees.find(employee => employee.id === user?.employee_id);

    if (isEditing && user && roles.length > 0 && userStates.length > 0 && employees.length > 0) {
      // Si formData ya tiene valores, no lo actualices
      if (!formData.name && !formData.email) {
        setFormData({ name: user.name, email: user.email });
      }

      // Si los valores seleccionados no tienen valores, actualízalos
      if (!selectedRole) {
        setSelectedRole(userRole ? { value: userRole, label: userRole.name } : null);
      }
      if (!selectedUserState) {
        setSelectedUserState(userState ? { value: userState, label: userState.name } : null);
      }
      if (!selectedEmployee) {
        setSelectedEmployee(userEmployee ? { value: userEmployee, label: userEmployee.full_name } : null);
      }
    }
  }, [isEditing, user, roles, userStates, employees, formData]);

  
  // Función para manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    // Validación para el campo name
    if (name === 'name') {
      const usernameError = validateUsername(value);
      if (usernameError) {
        error = usernameError;
      } else {
        error = '';
      }
    }

    // Validación para el campo email
    if (name === 'email') {
      const emailError = validateEmail(value);
      if (emailError) {
        error = emailError;
      } else {
        error = '';
      }
    }

    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el cambio del campo de rol
  const handleRoleChange = (option) => {
    setSelectedRole(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: option ? '' : 'Por favor, selecciona un rol.',
    }));
  };

  // Función para manejar el cambio del campo de estado de usuario
  const handleUserStateChange = (option) => {
    setSelectedUserState(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      state: option ? '' : 'Por favor, selecciona un estado.',
    }));
  };

  // Función para manejar el cambio del campo de empleado
  const handleEmployeeChange = (option) => {
    setSelectedEmployee(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      employee_id: option ? '' : 'Por favor, selecciona un empleado.',
    }));
  };

  // Función para enviar el formulario
  const handleSubmit = (e) => {
    // Evitar que el formulario recargue la página
    e.preventDefault();
    // Validar si hay errores en los campos
    const hasErrors = Object.values(errors).some((error) => error !== '');
    // Validar si hay errores en los campos de rol, estado de usuario y empleado
    if (!hasErrors) {
      const roleId = selectedRole ? selectedRole.value.id : null;
      const userStateId = selectedUserState ? selectedUserState.value.id : null;
      const employeeId = selectedEmployee ? selectedEmployee.value.id : null;
      const updatedFormData = { ...formData, role_id: roleId, user_state_id: userStateId, employee_id: employeeId };

      // Validar campos requeridos
      const { name, email, employee_id } = updatedFormData;
      const isCreating = !isEditing; // Determinar si se está creando un nuevo usuario

      if (isCreating) {
        // Validaciones para crear un nuevo usuario
        if (!name) {
          setErrors((prevErrors) => ({ ...prevErrors, name: 'El nombre es requerido.' }));
        }
        if (!email) {
          setErrors((prevErrors) => ({ ...prevErrors, email: 'El correo es requerido.' }));
        }
        if (!employee_id) {
          setErrors((prevErrors) => ({ ...prevErrors, employee_id: 'El empleado es requerido' }));
        }
      }

      // Enviar el formulario si no hay errores en los campos requeridos
      if ((isCreating && name && email && employee_id) || (!isCreating)) {
        onSubmit(updatedFormData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.role_id && <span className="text-red-500">{formErrors.role_id}<br /></span>}
      {formErrors.user_state_id && <span className="text-red-500">{formErrors.user_state_id}<br /></span>}
      <div className='mt-2'>
        <Input
          label="Nombre de usuario"
          id="name"
          placeholder="Ingresa un nombre"
          value={formData.name}
          onChange={handleChange}
          icon={RiUserLine}
          error={errors.name}
        />
      </div>
      <div className='mt-2'>
        <Input
          label="Correo electrónico"
          id="email"
          placeholder="Ingresa un correo"
          value={formData.email}
          onChange={handleChange}
          icon={RiMailLine}
          error={errors.email}
        />
      </div>
      <div className='mt-2'>
        <CustomSelect
          label="Empleado"
          options={employees}
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          placeholder="Selecciona un empleado"
          error={errors.employee_id}
          isSearchable={true}
          labelKey='full_name'
        />
      </div>
      <div className='mt-2'>
        <CustomSelect
          label="Rol"
          options={roles}
          value={selectedRole}
          onChange={handleRoleChange}
          placeholder="Selecciona un rol"
          error={errors.role}
          isSearchable={false}
        />
      </div>
      <div className='mt-2'>
        <CustomSelect
          label="Estado de usuario"
          options={userStates}
          value={selectedUserState}
          onChange={handleUserStateChange}
          placeholder="Selecciona un estado"
          error={errors.state}
          isSearchable={false}
        />
      </div>
      <div className="mt-6 flex items-center gap-x-2">
        <button
          type="submit"
          className={`p-2 px-1 ${confirmButtonColor} rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105`}
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

export default UserForm;