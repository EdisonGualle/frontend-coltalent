import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  let headerTitle = "";

  switch (location.pathname) {
    case "/perfil/datos-personales":
      headerTitle = "Datos Personales";
      break;
    case "/perfil/datos-laborales":
      headerTitle = "Datos Laborales";
      break;
    case "/perfil/educacion":
      headerTitle = "Educación";
      break;
      case "/perfil/idiomas":
        headerTitle = "Idiomas";
        break;
    case "/perfil/publicaciones":
      headerTitle = "Publicaciones";
      break;
    case "/perfil/capacitaciones":
      headerTitle = "Capacitaciones";
      break;
    case "/perfil/experiencia-laboral":
      headerTitle = "Experiencia Laboral";
      break;
    case "/perfil/referencia-laboral":
      headerTitle = "Referencia Laboral";
      break;
    case "/perfil/asistencias":
      headerTitle = "Asistencias";
      break;
    case "/perfil/permisos":
      headerTitle = "Permisos";
      break;
    case "/perfil/salidas-a-campo":
      headerTitle = "Salidas a Campo";
      break;
    case "/perfil/configuracion":
      headerTitle = "Configuración";
      break;
    case "/perfil/cambiar-contrasena":
      headerTitle = "Cambiar Contraseña";
      break;
    case "/perfil/notificaciones":
      headerTitle = "Notificaciones";
      break;
    default:
      headerTitle = "Tablero";
  }

  return (
    <div className=" bg-amber-100  rounded-t-lg p-3">
      <h2 className=" text-gray-700  text-lg font-bold uppercase  ">{headerTitle}</h2>
    </div>
  );
};

export default Header;
