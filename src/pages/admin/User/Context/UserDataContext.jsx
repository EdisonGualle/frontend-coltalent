import React, { createContext, useState, useEffect } from 'react';
import { getRoles } from '../../../../services/Rol/RolService';
import { getUserStates } from '../../../../services/User/UserStateService';
import { getEmployees } from '../../../../services/Employee/EmployeService1';
import { getUsers } from '../../../../services/User/UserService';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);

  const updateState = (response, setState) => {
    if (response.status === true) {
      setState(response.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        const [rolesResponse, userStatesResponse, employeesResponse, usersResponse ] = await Promise.all([
          getRoles(),
          getUserStates(),
          getEmployees(),
          getUsers(), 
        ]);

        updateState(rolesResponse, setRoles);
        updateState(userStatesResponse, setUserStates);
        updateState(employeesResponse, setEmployees);
        updateState(usersResponse, setUsers); 
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
      setIsLoading(false); // Establecer isLoading a false después de cargar los datos
    }
    };

    fetchData();
  }, []);

  const updateUsers = async () => {
    try {
      const usersResponse = await getUsers();
      updateState(usersResponse, setUsers);
    } catch (error) {
      console.error('Error al actualizar los usuarios:', error);
    }
  };

  return (
    <UserDataContext.Provider value={{ roles, userStates, employees, users, updateUsers, isLoading }}> 
      {children}
    </UserDataContext.Provider>
  );
};