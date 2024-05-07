import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from './UserCard';
import { fetchUsers, selectUsers } from '../../../../../redux/User/userSlice';

// Componente para la lista de usuarios
const UserList = () => {
  // Hook para despachar acciones
  const dispatch = useDispatch();

  // Usamos useSelector para acceder al estado global de usuarios
  const users = useSelector(selectUsers);

  // Definimos una función para actualizar la lista de usuarios
  const [filterValue, setFilterValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Usamos useEffect para despachar la acción fetchUsers cuando el componente se monta
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

    // Usamos useEffect para actualizar los usuarios filtrados cuando el estado de usuarios cambia
  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  // Función para filtrar usuarios basado en el valor de entrada
  const filterUsers = (value) => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    const filtered = users.filter((user) => {
      const { name, email } = user;
      const fullInfo = `${name} ${email}`.toLowerCase();
      return fullInfo.includes(value.toLowerCase());
    });
    setFilteredUsers(filtered);
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    filterUsers(value);
  };

  // Función para obtener la lista de usuarios y actualizar el estado local
  const fetchUsersAndUpdateList = useCallback(() => {
    dispatch(fetchUsers())
      .then((response) => {
        setFilteredUsers(response.payload);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, [dispatch]);

  return (
    <div className="mb-6">
      <div className="mb-4 mt-1 sm:flex sm:gap-x-2">
        <label htmlFor="filter" className="font-semibold text-gray-700">
          Buscar:
        </label>
        <input
          id="filter"
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder={`${users ? users.length : 0} registros...`}
          className="text-sm px-2 py-1 border border-gray-300 mt-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 sm:mt-0"
        />
      </div>
      {users && users.length > 0 ? (
        filteredUsers.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} updateUsers={fetchUsersAndUpdateList} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-base text-red-500">No hay usuarios que coincidan con su busqueda.</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-5 gap-6 animate-pulse">
          {Array(5).fill().map((_, i) => (
            <div key={i} className="bg-blue-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform">
              <div className="flex flex-col items-center gap-2 p-4 relative">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-blue-300 shadow-lg flex items-center justify-center bg-gray-200"></div>
                </div>
                <div className="text-center w-full">
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-32 mt-1"></div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;