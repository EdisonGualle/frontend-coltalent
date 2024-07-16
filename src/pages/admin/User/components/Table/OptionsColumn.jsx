import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { RiMore2Fill, RiEdit2Line, RiUserUnfollowLine, RiDeleteBin6Line } from 'react-icons/ri';
import { VscActivateBreakpoints } from 'react-icons/vsc';
import Dialog2 from '../../../../../components/ui/Dialog2';
import ModalForm from '../../../../../components/ui/ModalForm';
import UserForm from '../UserForm';
import { selectUsers, deleteUserAction, enableUserAction, disableUserAction } from '../../../../../redux/User/userSlice';
import store from '../../../../../redux/store';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { updateUser } from '../../../../../services/User/UserService';

// Componente para la columna de opciones de la tabla de usuarios
const selectUsersRef = selectUsers;

// Componente para la columna de opciones de la tabla de usuarios
const OptionsColumn = ({ user, updateUsers }) => {
 // Hook para despachar acciones
  const dispatch = useDispatch();
  // Inicializamos los estados locales
  const [users, setUsers] = useState([]);
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [action, setAction] = useState('');
  const [formErrors, setFormErrors] = useState({});
  // Inicializamos el contexto para mostrar alertas
  const { showAlert } = useContext(AlertContext);

  // Efecto para limpiar los errores del formulario al cerrar el modal
  useEffect(() => {
    if (!isOpenEditModal) {
      setFormErrors({});
    }
  }, [isOpenEditModal]);

  // Efecto para mostrar los errores del formulario al abrir el modal
  useEffect(() => {
    if (isOpenEditModal && Object.values(formErrors).some(Boolean)) {
      setIsOpenEditModal(true);
    }
  }, [formErrors, isOpenEditModal]);

  useEffect(() => {
    // Suscribirse al estado global para obtener la lista de usuarios
    const unsubscribe = store.subscribe(() => {
      // Obtener la lista de usuarios del estado global
      const newUsers = selectUsersRef(store.getState());
      // Actualizar la lista de usuarios
      setUsers(newUsers);
    });

    // Retornar la función para cancelar la suscripción
    return unsubscribe;
  }, [selectUsersRef]);

  // Funciones para realizar acciones en la tabla
  const actionFunctions = {
    desactivar: async () => {
      try {
        dispatch(disableUserAction(user.id));
        updateUsers(); 
        showAlert('Usuario desactivado correctamente', 'success');
      } catch (error) {
        showAlert('Error al desactivar el usuario', 'error');
      }
    },
    activar: async () => {
      try {
        dispatch(enableUserAction(user.id));
        updateUsers(); 
        showAlert('Usuario activado correctamente', 'success');
      } catch (error) {
        showAlert('Error al activar el usuario', 'error');
      }
    },
    eliminar: async () => {
      try {
        dispatch(deleteUserAction(user.id));
        updateUsers(); 
        showAlert('Usuario eliminado correctamente', 'success');
      } catch (error) {
        showAlert('Error al eliminar el usuario', 'error');
      }
    },
    editar: async (formData) => {
      try {
        // Obtener los datos del formulario
        const { name, email, role_id, user_state_id, employee_id } = formData;
        // Actualizar el usuario
        const updatedUser = { id: user.id, name, email, role_id, user_state_id, employee_id };
        await updateUser(updatedUser, user.id);
        showAlert('Usuario actualizado correctamente', 'success');
        updateUsers(); 
        setFormErrors({});
        setIsOpenEditModal(false);
      } catch (error) {
        // Mostrar alerta si hay errores
        const { errors } = error || {};
        // Obtener los errores del formulario
        const formErrors = {
          name: errors?.name ? errors.name.join(', ') : '',
          email: errors?.email ? errors.email.join(', ') : '',
          role_id: errors?.role_id ? errors.role_id.join(', ') : '',
          user_state_id: errors?.user_state_id ? errors.user_state_id.join(', ') : '',
          employee_id: errors?.employee_id ? errors.employee_id.join(', ') : '',
        };
        // Mostrar alerta si hay errores
        if (Object.values(formErrors).some(error => error !== '')) {
          setFormErrors(formErrors);
        } else {
          showAlert(error.message || 'Error al actualizar el usuario', 'error');
          setIsOpenEditModal(false);
        }
      }
    },
  };

  // Funciones para manejar los eventos de los botones
  const handleEditClick = () => {
    setIsOpenEditModal(true);
  };

  const handleConfirmEdit = (formData) => {
    actionFunctions.editar(formData);
  };

  const handleCancelEdit = () => {
    setFormErrors({});
    setIsOpenEditModal(false);
  };

  const handleConfirm = async () => {
    await actionFunctions[action]();
    setIsOpenDialog2(false);
  };

  const handleCancel = () => {
    setIsOpenDialog2(false);
  };

  const handleActionClick = (actionType) => {
    setIsOpenDialog2(true);
    setAction(actionType);
  };


  return (
    <>
      <Menu
        menuButton={
          <MenuButton className="flex items-center justify-center w-8 h-8 hover:bg-gray-300 rounded-lg transition-colors">
            <RiMore2Fill className="text-gray-400" />
          </MenuButton>
        }
        align="end"
        arrow
        arrowClassName="bg-gray-300"
        transition
        menuClassName="bg-gray-300 p-1 rounded-lg shadow-lg"
      >
        <div className=" scroll-editado overflow-y-auto h-[13vh]">
          <MenuItem className="p-0 hover:bg-transparent" onClick={handleEditClick}>
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiEdit2Line className="text-blue-500" />
              <span className="truncate">Editar</span>
            </button>
          </MenuItem>
          <MenuItem
            className="p-0 hover:bg-transparent"
            onClick={() => handleActionClick('desactivar')}
          >
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiUserUnfollowLine className="text-yellow-500" />
              <span className="truncate">Desactivar</span>
            </button>
          </MenuItem>
          <MenuItem
            className="p-0 hover:bg-transparent"
            onClick={() => handleActionClick('activar')}
          >
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <VscActivateBreakpoints className="text-green-500" />
              <span className="truncate">Activar</span>
            </button>
          </MenuItem>
          {/* <MenuItem
            className="p-0 hover:bg-transparent"
            onClick={() => handleActionClick('eliminar')}
          >
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiDeleteBin6Line className="text-red-500" />
              <span className="truncate">Eliminar</span>
            </button>
          </MenuItem> */}
        </div>
      </Menu>
      <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title={
          action === 'eliminar'
            ? '¿Eliminar usuario?'
            : action === 'desactivar'
              ? '¿Desactivar usuario?'
              : '¿Activar usuario?'
        }
        description={
          action === 'eliminar'
            ? '¿Está seguro que desea eliminar el usuario? Esta acción es permanente y no se podrá deshacer. Todos los datos del usuario se eliminarán.'
            : action === 'desactivar'
              ? '¿Está seguro que desea desactivar el usuario? El usuario no podrá acceder al sistema hasta que se reactive su cuenta.'
              : '¿Está seguro que desea activar el usuario? El usuario podrá acceder al sistema nuevamente.'
        }
        confirmButtonText={`Sí, ${action === 'eliminar'
          ? 'eliminar'
          : action === 'desactivar'
            ? 'desactivar'
            : 'activar'
          } usuario`}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor={
          action === 'eliminar'
            ? 'bg-red-500'
            : action === 'desactivar'
              ? 'bg-yellow-500'
              : 'bg-green-500'
        }
        cancelButtonColor="border-gray-400"
        icon={
          action === 'eliminar' ? (
            <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
          ) : action === 'desactivar' ? (
            <RiUserUnfollowLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
          ) : (
            <VscActivateBreakpoints className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
          )
        }
      />
      <ModalForm
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        title="Editar usuario"
        icon={<RiEdit2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <UserForm
          user={user}
          isEditing={true}
          onSubmit={handleConfirmEdit}
          onCancel={handleCancelEdit}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default OptionsColumn;