import React from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Navega a la página anterior
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="px-40 py-20 bg-white rounded-md">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-blue-600 text-9xl">404</h1>
          <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
            <span className="text-red-500">¡Ops!</span> Página no encontrada
          </h6>
          <p className="mb-8 text-center text-gray-500 md:text-lg">
            La página que estás buscando no existe.
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100"
          >
            Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;
