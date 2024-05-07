import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { RiGalleryView2, RiUserAddLine, RiListView } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import UserList from './components/Card/UserList';
import UserTable from './components/Table/UserTable';
import ModalForm from '../../../components/ui/ModalForm';
import UserForm from './components/UserForm';
import { fetchUsers } from '../../../redux/User/userSlice';
import { createUser } from '../../../services/User/UserService';
import { AlertContext } from '../../../contexts/AlertContext';

// Componente principal de la pagina de usuarios
const UserIndex = () => {
  const dispatch = useDispatch();
  // Estado para mostrar la lista o la tabla de usuarios
  const [showList, setShowList] = useState(true);
  // Estado para controlar la apertura del modal de creación de usuarios
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  // Estado para almacenar los errores del formulario
  const [formErrors, setFormErrors] = useState({});
  // Contexto para mostrar alertas
  const { showAlert } = useContext(AlertContext);

  // Función para cambiar la vista de la lista de usuarios
  const handleViewChange = (view) => {
    setShowList(view === 'list' || view === 'gallery');
  };

  // Función para abrir el modal de creación de usuarios
  const handleOpenCreateModal = () => {
    setIsOpenCreateModal(true);
    setFormErrors({});
  };

  // Función para crear un nuevo usuario
  const handleCreateUser = async (formData) => {
    try {
      // Realiza la petición para crear un usuario
      await createUser(formData);
      // Muestra una alerta de éxito
      showAlert('Usuario creado correctamente', 'success');
      // Cierra el modal de creación de usuarios
      setIsOpenCreateModal(false); 
      // Limpia los errores del formulario
      setFormErrors({}); 
      // Actualiza la lista de usuarios
      dispatch(fetchUsers());
    } catch (error) {
      // Obtiene los errores de la respuesta
      const { errors } = error.response.data || {};

      // Asigna los errores a formErrors
      const formErrors = {
        name: errors?.name ? errors.name.join(', ') : '',
        email: errors?.email ? errors.email.join(', ') : '',
        role_id: errors?.role_id ? errors.role_id.join(', ') : '',
        user_state_id: errors?.user_state_id ? errors.user_state_id.join(', ') : '',
        employee_id: errors?.employee_id ? errors.employee_id.join(', ') : '',
      };

      // Si hay errores en el formulario, los muestra
      if (Object.values(formErrors).some(error => error !== '')) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al crear el usuario', 'error');
        setIsOpenCreateModal(false);
      }
    }
  };

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de usuarios
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver información sobre todos los usuarios
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center bg-cyan-500 text-white hover:bg-cyan-600 transition-colors rounded-xl" size="sm" onClick={() => handleViewChange('gallery')}>
              <RiGalleryView2 className="h-5 w-5" />
            </Button>
            <Button className="flex items-center bg-teal-500 text-white hover:bg-teal-600 transition-colors rounded-xl" size="sm" onClick={() => handleViewChange('table')}>
              <RiListView className="h-5 w-5" />
            </Button>
            <Button className="flex items-center gap-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-xl py-2 px-5"
              size="sm"
              onClick={handleOpenCreateModal}>
              <RiUserAddLine className="h-5 w-5" />
              <span className="font-semibold">Nuevo Usuario</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      {showList ? (
        <UserList />
      ) : (
        <UserTable />
      )}
      <ModalForm
        isOpen={isOpenCreateModal}
        setIsOpen={setIsOpenCreateModal}
        title="Crear nuevo usuario"
        icon={<RiUserAddLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <UserForm
          isEditing={false}
          onSubmit={handleCreateUser}
          onCancel={() => setIsOpenCreateModal(false)}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default UserIndex;