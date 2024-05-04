import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AxiosInstance from "../services/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); 


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setLoading(true);
          const response = await AxiosInstance.get('user-auth');
          const userData = response.data.data;
          setUser(userData);
          setUserRole(userData.role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthentication();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post('login', credentials);
      const userData = response.data.data;
      setUser(userData);
      setUserRole(userData.role);
      localStorage.setItem('token', userData.token);
      setIsAuthenticated(true); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AxiosInstance.post('logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };


  return (
    <AuthContext.Provider value={{ user,userRole, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};