import React from "react";
import { useLocation } from "react-router-dom";

const PerfilHeader = () => {
  const location = useLocation();
  let headerTitle = "";

  // Obtén el segmento final de la URL después del ID del empleado
  const pathSegments = location.pathname.split('/');
  const section = pathSegments[pathSegments.length - 1];

  switch (section) {
    case "datos-personales":
      headerTitle = "Datos Personales";
      break;
    case "datos-contacto":
      headerTitle = "Datos de Contacto";
      break;
    case "datos-residencia":
      headerTitle = "Datos de Residencia";
      break;
    case "datos-laborales":
      headerTitle = "Datos Laborales";
      break;
    case "educacion":
      headerTitle = "Educación";
      break;
    case "idiomas":
      headerTitle = "Idiomas";
      break;
    case "publicaciones":
      headerTitle = "Publicaciones";
      break;
    case "capacitaciones":
      headerTitle = "Capacitaciones";
      break;
    case "experiencia-laboral":
      headerTitle = "Experiencia Laboral";
      break;
    case "referencia-laboral":
      headerTitle = "Referencia Laboral";
      break;
    case "asistencias":
      headerTitle = "Asistencias";
      break;
    case "permisos":
      headerTitle = "Permisos";
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

export default PerfilHeader;
