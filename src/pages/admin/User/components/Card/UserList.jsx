import React, { useContext, useState, useEffect } from 'react';
import UserCard from './UserCard';
import { UserDataContext } from '../../Context/UserDataContext';

const UserList = () => {
  const { users, updateUsers } = useContext(UserDataContext);
  const [filterValue, setFilterValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);

  useEffect(() => {
    setFilteredUsers(users || []);
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
              <UserCard key={user.id} user={user} updateUsers={updateUsers} />
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