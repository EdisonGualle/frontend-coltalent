import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from './UserCard';
import { fetchUsers, selectUsers } from '../../../../../redux/User/userSlice';
import { MdSearch } from 'react-icons/md';


const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [filterValue, setFilterValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

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

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    filterUsers(value);
  };

  const fetchUsersAndUpdateList = useCallback(() => {
    dispatch(fetchUsers())
      .then((response) => {
        setFilteredUsers(response.payload);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, [dispatch]);

  if (users === undefined || users.length === 0) {
    return (
      <>
        <div className="mb-4 mt-1 sm:flex sm:gap-x-2 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-1 sm:mt-0"></div>
        </div>
        <div className="grid grid-cols-5 gap-6 animate-pulse">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-blue-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
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
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="my-2">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center max-w-md mx-auto h-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 blur-lg group-hover:opacity-75 transition-all duration-300"></div>
              <div className="relative w-full bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-white border-opacity-50 group-hover:shadow-lg transition-all duration-300">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filterValue}
                  onChange={handleFilterChange}
                  className="w-full pl-4 pr-12 py-2 text-base text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 bg-opacity-50 rounded-md text-gray-600 overflow-hidden transition-all duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <MdSearch className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        {users && users.length > 0 ? (
          filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} updateUsers={fetchUsersAndUpdateList} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-base text-red-300">No hay usuarios que coincidan con su búsqueda.</p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-base text-gray-500">No hay usuarios registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;