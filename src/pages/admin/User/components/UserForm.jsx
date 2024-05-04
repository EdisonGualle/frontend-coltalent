import React, { useState, useEffect, useContext } from 'react';
import Input from '../../../../components/ui/Input';
import { RiUserLine, RiMailLine } from 'react-icons/ri';
import { validateUsername, validateEmail } from '../../../../Utils/validationsV2.js';
import CustomSelect from '../../../../components/ui/Select.jsx';
import { UserDataContext } from '../Context/UserDataContext.jsx';


const UserForm = ({
  user,
  isEditing,
  onSubmit,
  onCancel,
  confirmButtonText = isEditing ? 'Guardar cambios' : 'Crear usuario', 
  cancelButtonText = 'Cancelar',
  confirmButtonColor = 'bg-blue-500',
  cancelButtonColor = 'border-gray-400',
  formErrors = {}
}) => {
  const {roles, userStates, employees } = useContext(UserDataContext);
  const [errors, setErrors] = useState({ name: '', email: '', role: '', role_id: '', state:'',  state_id: '', employee:'', employee_id: ''});
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserState, setSelectedUserState] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (isEditing && user && roles.length > 0 && userStates.length > 0 && employees.length > 0) {
      setFormData({ name: user.name, email: user.email });

      // Buscar el rol del usuario en el arreglo roles
      const userRole = roles.find(role => role.id === user.role.id);

      // Asignar el rol del usuario a selectedRole con la estructura correcta
      setSelectedRole(userRole ? { value: userRole, label: userRole.name } : null);

      // Buscar el estado del usuario en el arreglo userStates
      const userState = userStates.find(state => state.id === user.user_state.id);

      // Asignar el estado del usuario a selectedUserState con la estructura correcta
      setSelectedUserState(userState ? { value: userState, label: userState.name } : null);

      // Buscar el empleado del usuario en el arreglo employees
      const userEmployee = employees.find(employee => employee.id === user.employee_id);

      // Asignar el empleado del usuario a selectedEmployee con la estructura correcta
      setSelectedEmployee(userEmployee ? { value: userEmployee, label: userEmployee.full_name } : null);
    }
  }, [isEditing, user, roles, userStates, employees]);




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

  const handleRoleChange = (option) => {

    setSelectedRole(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: option ? '' : 'Por favor, selecciona un rol.', // Mensaje de error personalizado
    }));
  };

  const handleUserStateChange = (option) => {
    setSelectedUserState(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      state: option ? '' : 'Por favor, selecciona un estado.', // Mensaje de error personalizado
    }));
  };

  const handleEmployeeChange = (option) => {
    setSelectedEmployee(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      employee_id: option ? '' : 'Por favor, selecciona un empleado.',  
    })); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== '');
  
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
      {formErrors.name && <span className="text-red-500">{formErrors.name}<br /></span>}
      {formErrors.email && <span className="text-red-500">{formErrors.email}<br /></span>}
      {formErrors.role_id && <span className="text-red-500">{formErrors.role_id}<br /></span>}
      {formErrors.user_state_id && <span className="text-red-500">{formErrors.user_state_id}<br /></span>}
      {formErrors.employee_id && <span className="text-red-500">{formErrors.employee_id}<br /></span>}
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