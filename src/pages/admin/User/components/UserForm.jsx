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
  user,
  isEditing,
  onSubmit,
  onCancel,
  confirmButtonColor = 'bg-blue-500',
  cancelButtonColor = 'border-gray-400',
  formErrors = {}
}) => {
  const dispatch = useDispatch();
  const roles = useSelector(state => state.role?.roles ?? []);
  const userStates = useSelector(state => state.userState?.userStates ?? []);
  const employees = useSelector(state => state.employee?.employees ?? []);

  const [errors, setErrors] = useState({
    name: '', email: '', role: '', state: '', employee_id: ''
  });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserState, setSelectedUserState] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // etiquetas dinámicas
  const submitLabel = isEditing ? 'Guardar cambios' : 'Crear usuario';
  const cancelLabel = 'Cancelar';

  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  // cargar catálogos
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchUserStates());
    dispatch(fetchEmployees());
  }, [dispatch]);

  // precarga en edición
  useEffect(() => {
    if (
      isEditing &&
      user &&
      roles.length &&
      userStates.length &&
      employees.length
    ) {
      setFormData({ name: user.name, email: user.email });

      const rol = roles.find(r => r.id === user.role.id);
      if (rol) setSelectedRole({ value: rol, label: rol.name });

      const st = userStates.find(s => s.id === user.user_state.id);
      if (st) setSelectedUserState({ value: st, label: st.name });

      const emp = employees.find(e => e.id === user.employee_id);
      if (emp)
        setSelectedEmployee({ value: emp, label: emp.full_name });
    }
  }, [isEditing, user, roles, userStates, employees]);

  const handleChange = e => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'name') {
      error = validateUsername(value) || '';
    }
    if (name === 'email') {
      error = validateEmail(value) || '';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = option => {
    setSelectedRole(option);
    setErrors(prev => ({
      ...prev,
      role: option ? '' : 'Por favor, selecciona un rol.'
    }));
  };

  const handleUserStateChange = option => {
    setSelectedUserState(option);
    setErrors(prev => ({
      ...prev,
      state: option ? '' : 'Por favor, selecciona un estado.'
    }));
  };

  const handleEmployeeChange = option => {
    setSelectedEmployee(option);
    setErrors(prev => ({
      ...prev,
      employee_id: option ? '' : 'Por favor, selecciona un empleado.'
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) return;

    const role_id = selectedRole?.value.id ?? null;
    const user_state_id = selectedUserState?.value.id ?? null;
    const employee_id = selectedEmployee?.value.id ?? null;
    const payload = {
      ...formData,
      role_id,
      user_state_id,
      employee_id
    };

    if (!isEditing) {
      if (!payload.name) setErrors(prev => ({ ...prev, name: 'El nombre es requerido.' }));
      if (!payload.email) setErrors(prev => ({ ...prev, email: 'El correo es requerido.' }));
      if (!payload.employee_id)
        setErrors(prev => ({ ...prev, employee_id: 'El empleado es requerido.' }));
      if (!payload.name || !payload.email || !payload.employee_id) return;
    }
    console.log('Payload:', payload);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.role_id && (
        <span className="text-red-500">{formErrors.role_id}<br /></span>
      )}
      {formErrors.user_state_id && (
        <span className="text-red-500">{formErrors.user_state_id}<br /></span>
      )}

      <div className="mt-2">
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

      <div className="mt-2">
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

      <div className="mt-2">
        <CustomSelect
          label="Empleado"
          options={employees}
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          placeholder="Selecciona un empleado"
          error={errors.employee_id}
          isSearchable
          labelKey="full_name"
        />
      </div>

      <div className="mt-2">
        <CustomSelect
          label="Rol"
          options={roles}
          value={selectedRole}
          onChange={handleRoleChange}
          placeholder="Selecciona un rol"
          error={errors.role}
        />
      </div>

      <div className="mt-2">
        <CustomSelect
          label="Estado de usuario"
          options={userStates}
          value={selectedUserState}
          onChange={handleUserStateChange}
          placeholder="Selecciona un estado"
          error={errors.state}
        />
      </div>

      <div className="mt-6 flex items-center gap-x-2">
        <button
          type="submit"
          className={`
            p-2 px-1 ${confirmButtonColor} rounded-xl text-white w-full
            outline-none transform transition-all duration-300 hover:scale-105
          `}
        >
          {submitLabel}
        </button>
        <button
          type="button"
          className={`
            p-2 rounded-xl bg-transparent border-dashed ${cancelButtonColor} w-full
            outline-none transform transition-all duration-300 hover:scale-105
          `}
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
