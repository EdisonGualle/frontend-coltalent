import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { getEmployee } from "../../../services/Employee/EmployeService1";

const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams(); // Obtener el ID de los parámetros de la URL
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchEmployeeName = async () => {
      try {
        const response = await getEmployee(id);
        if (response && response.data && response.data.employee_name) {
          setEmployeeName(response.data.employee_name); 
        }
      } catch (error) {
        // Puedes manejar el error aquí si es necesario, por ejemplo, mostrando un mensaje al usuario
      }
    };

    if (id) {
      fetchEmployeeName();
    }
  }, [id]);

  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment);

  const breadcrumbItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
  ];

  pathSegments.forEach((segment, index) => {
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

    // Añade casos específicos para rutas conocidas y ajusta la etiqueta según sea necesario
    switch(segment) {
      case 'empleados':
        label = 'Empleados';
        break;
      case 'usuarios':
        label = 'Usuarios';
        break;
      case 'asistencia':
        label = 'Asistencia';
        break;
      case 'perfil':
        label = 'Perfil';
        break;
      case id:
        label = employeeName || id; // Usa el nombre del empleado si está disponible
        break;
      case 'datos-personales':
        label = 'Datos Personales';
        break;
      case 'datos-contacto':
        label = 'Datos de Contacto';
        break;
      case 'datos-residencia':
        label = 'Datos de Residencia';
        break;
      case 'datos-laborales':
        label = 'Datos Laborales';
        break;
      case 'educacion':
        label = 'Educación';
        break;
      case 'idiomas':
        label = 'Idiomas';
        break;
      case 'publicaciones':
        label = 'Publicaciones';
        break;
      case 'capacitaciones':
        label = 'Capacitaciones';
        break;
      case 'experiencia-laboral':
        label = 'Experiencia Laboral';
        break;
      case 'referencia-laboral':
        label = 'Referencia Laboral';
        break;
      case 'configuracion':
        label = 'Configuración';
        break;
      case 'cargos':
        label = 'Cargos';
        break;
      case 'motivos-rechazo':
        label = 'Motivos de Rechazo';
        break;
      case 'dias-festivos':
        label = 'Días Festivos';
        break;
      default:
        break;
    }

    breadcrumbItems.push({ label, path, isClickable: segment !== 'perfil' });
  });

  return (
    <nav aria-label="Breadcrumb" className="rounded-lg px-2 py-1">
      <ol className="flex items-center gap-1 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.isClickable ? (
                <Link to={item.path} className=" transition hover:text-black flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className=" transition text-gray-900 flex items-center cursor-default">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
            {index !== breadcrumbItems.length - 1 && (
              <li className="rtl:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
