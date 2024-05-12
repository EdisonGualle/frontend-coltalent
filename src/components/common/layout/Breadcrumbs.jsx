import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Breadcrumbs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const breadcrumbItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { label: "Empleados", path: "/empleados" },
    { label: "Direcciones", path: "/direcciones" },
    { label: "Unidades", path: "/unidades" },
    { label: "Perfil", path: "/perfil" },
    { label: "Cargos", path: "/cargos" },
    { label: "Usuarios", path: "/usuarios" },
    { label: "Configuración", path: "/perfil/configuracion" },
  ];

  const activeBreadcrumbItems = breadcrumbItems.filter((item) =>
    currentPath.startsWith(item.path)
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="mt-2 border-b-2 bg-gray-300 border-gray-600 shadow-lg rounded-lg px-2 py-1"
    >
      <ol className="flex items-center gap-1 text-sm text-gray-600">
        {activeBreadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <Link
                to={item.path}
                className="block transition hover:text-gray-700 flex items-center"
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
            {index !== activeBreadcrumbItems.length - 1 && (
              <li className="rtl:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
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