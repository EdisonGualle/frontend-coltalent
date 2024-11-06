import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AlertContext } from '../../contexts/AlertContext';

import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

const Login = () => {
  const { showAlert } = useContext(AlertContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email" && e.target.value !== "") {
      setEmailError('');
    }

    if (e.target.name === "password" && e.target.value !== "") {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si los campos están llenos
    if (!formData.email) {
      setEmailError('La dirección de correo es requerida');
    } else {
      setEmailError('');
    }

    if (!formData.password) {
      setPasswordError('La contraseña es requerida');
    } else {
      setPasswordError('');
    }

    if (!formData.email || !formData.password) {
      return;
    }

    setLoading(true); // Inicia la carga al hacer la petición

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setErrorMessage(error.response.data.msg);
      } else {
        showAlert('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.', 'error');
      }
    } finally {
      setLoading(false); // Finaliza la carga independientemente del resultado
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-700 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-secondary-50 mb-8">
          Iniciar <span className="text-primary">sesión</span>
        </h1>
        {/* Mostrar el error del backend si está presente */}
        {errorMessage && <div className=" mt-0 text-red-300 mb-2 ">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative ">
            <RiMailLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="py-3 pl-8 pr-4 bg-secondary-50 w-full outline-none rounded-lg"
              placeholder="Correo electrónico"
            />
          </div>
          {/* Mostrar el error del correo si está presente */}
          {emailError && <div className="text-red-300  text-xs md:text-sm">{emailError}</div>}

          <div className="relative  mt-4">
            <RiLockLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="py-3 px-8 bg-secondary-50 w-full outline-none rounded-lg"
              placeholder="Contraseña"
              autoComplete="current-password"
            />
            {showPassword ? (
              <RiEyeOffLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            ) : (
              <RiEyeLine
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            )}
          </div>
          {/* Mostrar el error de la contraseña si está presente */}
          {passwordError && <div className="text-red-300 text-xs md:text-sm">{passwordError}</div>}
          <div>
            <button
              type="submit"
              className={`bg-primary text-black uppercase font-bold text-sm w-full mt-5 py-3 px-4 rounded-lg ${loading ? " opacity-95" : "hover:bg-yellow-400"}`} 
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/forgot-password"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
