import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  RiLogoutCircleRLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiUser3Line,
  RiDashboardLine,
  RiUserStarLine,
  RiSettings3Line,
  RiShieldUserLine,
  RiFileUserLine,
  RiFileTextLine,
  RiCalendarScheduleLine
} from "react-icons/ri";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { LiaFileContractSolid } from "react-icons/lia";


import { useAuth } from "../../../hooks/useAuth";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const { logout, userRole, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si un submenú está activo
  const isSubmenuActive = (paths) => paths.includes(location.pathname);

  const toggleSubMenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => logout();

  return (
    <>
      <div
        className={`xl:h-[100vh] absolute overflow-y-scroll xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-gray-300 flex flex-col justify-between z-50 ${showMenu ? "left-0" : "-left-full"
          } transition-all`}
      >
        <div>
          <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-br-3xl shadow sticky top-0 z-10">
            <h1 className="text-2xl font-bold">COLTALENT</h1>
            <p className="text-sm opacity-75">Gestión Eficiente de RRHH</p>
          </div>

          {/* Menú principal */}
          <ul className="flex-1 space-y-2 px-4 py-8">

            {/* Separador */}
            <hr className="pb-2" />

            {/* Tablero */}
            <li className="group">
              <Link
                to="/"
                className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === "/"
                  ? "bg-gray-100 text-blue-700 shadow "
                  : "hover:bg-blue-50 hover:text-blue-700 "
                  }`}
              >
                <RiDashboardLine
                  className={`text-xl ${location.pathname === "/"
                    ? "text-blue-700"
                    : "text-gray-800 group-hover:text-blue-700"}`}
                />
                <span className="font-medium">Tablero</span>
              </Link>
            </li>

            {/* Perfil - Acceso Administrador*/}
            <li className="group">
              <button
                onClick={() => handleNavigate(`/perfil/${user.employee_id}/datos-personales`)}
                className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === `/perfil/${user.employee_id}/datos-personales`
                  ? "bg-gray-100 text-blue-700 shadow"
                  : "hover:bg-blue-50 hover:text-blue-700"
                  }`}
              >
                <RiShieldUserLine className={`text-xl ${location.pathname === `/perfil/${user.employee_id}/datos-personales`
                  ? "text-blue-700"
                  : "text-gray-800 group-hover:text-blue-700"
                  }`} />
                <span className="font-medium">Perfil</span>
              </button>
            </li>

            {/* Empleados - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/empleados"
                  className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === `/empleados`
                    ? "bg-gray-100 text-blue-700 shadow"
                    : "hover:bg-blue-50 hover:text-blue-700 "
                    }`}
                >
                  <RiUserStarLine className={`text-xl ${location.pathname === `/empleados`
                    ? "text-blue-700"
                    : "text-gray-800 group-hover:text-blue-700"
                    }`} />
                  <span className="font-medium">Empleados</span>
                </Link>
              </li>
            )}

            {/* Contratos - Acceso Administrador */}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/contratos"
                  className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === `/contratos`
                    ? "bg-gray-100 text-blue-700 shadow"
                    : "hover:bg-blue-50 hover:text-blue-700 "
                    }`}
                >
                  <LiaFileContractSolid className={`text-xl ${location.pathname === `/contratos`
                    ? "text-blue-700"
                    : "text-gray-800 group-hover:text-blue-700"
                    }`} />
                  <span className="font-medium">Contratos</span>
                </Link>
              </li>
            )}

            {/* Usuarios - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/usuarios"
                  className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === `/usuarios`
                    ? "bg-gray-100 text-blue-700 shadow"
                    : "hover:bg-blue-50 hover:text-blue-700 "
                    }`}
                >
                  <RiUser3Line className={`text-xl ${location.pathname === `/usuarios`
                    ? "text-blue-700"
                    : "text-gray-800 group-hover:text-blue-700"
                    }`} />
                  <span className="font-medium">Usuarios</span>
                </Link>
              </li>
            )}

            {/* Permisos */}
            <li>
              <button
                onClick={() => toggleSubMenu(3)}
                className="group w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-4">
                  <RiFileTextLine className="text-xl text-gray-800 group-hover:text-blue-700" />
                  <span className="font-medium">Permisos</span>
                </span>
                <RiArrowRightSLine
                  className={`${activeSubmenu === 3 ? "rotate-90 text-blue-700" : "text-gray-800 "
                    } transition-transform`}
                />
              </button>
              <ul
                className={`mt-2 space-y-1 pl-8 overflow-hidden transition-all ${activeSubmenu === 3 ? "h-auto" : "h-0"
                  }`}
              >
                <li>
                  <button
                    onClick={() => handleNavigate(`/permisos/${user.employee_id}/solicitar`)}
                    className={`w-full flex items-start py-2 px-4 text-sm rounded-lg ${location.pathname === `/permisos/${user.employee_id}/solicitar`
                      ? "bg-gray-100 text-blue-700 shadow"
                      : "hover:bg-blue-50 "
                      }`}
                  >
                    Solicitudes
                  </button>
                </li>

                {/* Autorizaciones - Acceso Administrador, Jefe Dirección, Jefe Unidad, Jefe General */}
                {(userRole === 'Administrador' || userRole === 'Jefe Dirección' || userRole === 'Jefe Unidad' || userRole === 'Jefe General') && (
                  <li>
                    <Link
                      to="/permisos/autorizaciones"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/permisos/autorizaciones"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Autorizaciones
                    </Link>
                  </li>
                )}


                {/* Tipos de Permisos - Acceso Administrador */}
                {(userRole === 'Administrador') && (
                  <li>

                    <Link
                      to="/permisos/tipos"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/permisos/tipos"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Tipos de Permisos
                    </Link>
                  </li>
                )}

                {/* Motivos de Rechazo - Acceso Administrador */}
                {(userRole === 'Administrador') && (
                  <li>
                    <Link
                      to="/permisos/motivos-rechazo"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/permisos/motivos-rechazo"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Motivos de Rechazo
                    </Link>
                  </li>
                )}
              </ul>
            </li>

            {/* Horarios */}
            <li>
              <button
                onClick={() => toggleSubMenu(5)}
                className="group w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-4">
                  <RiCalendarScheduleLine className="text-xl text-gray-800 group-hover:text-blue-700" />
                  <span className="font-medium">Horarios</span>
                </span>
                <RiArrowRightSLine
                  className={`${activeSubmenu === 3 ? "rotate-90 text-blue-700" : "text-gray-800 "
                    } transition-transform`}
                />
              </button>
              <ul
                className={`mt-2 space-y-1 pl-8 overflow-hidden transition-all ${activeSubmenu === 5 ? "h-auto" : "h-0"
                  }`}
              >
                <li>
                  <Link
                    to="/horarios"
                    className={`w-full flex items-start py-2 px-4 text-sm rounded-lg ${location.pathname === `/horarios`
                      ? "bg-gray-100 text-blue-700 shadow"
                      : "hover:bg-blue-50 "
                      }`}
                  >
                    Horarios Laborales
                  </Link>
                </li>

                {/* Días Festivos - Acceso Administrador*/}
                {(userRole === 'Administrador') && (
                  <li>
                    <Link
                      to="/dias-festivos"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/dias-festivos"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Días Festivos
                    </Link>
                  </li>
                )}
              </ul>
            </li>

            {/* Subrogaciones */}
            <li className="group">
              <Link
                to="/Subrogaciones"
                className={`w-full flex items-center gap-4 py-2 px-4 mb-4 rounded-lg ${location.pathname === `/Subrogaciones`
                  ? "bg-gray-100 text-blue-700 shadow"
                  : "hover:bg-blue-50 hover:text-blue-700"
                  }`}
              >
                <RiFileUserLine className={`text-xl ${location.pathname === `/Subrogaciones`
                  ? "text-blue-700"
                  : "text-gray-800 group-hover:text-blue-700"
                  }`} />
                <span className="font-medium">Subrogaciones</span>
              </Link>
            </li>


            {/* Organización */}
            {userRole === "Administrador" && (
              <li>
                <button
                  onClick={() => toggleSubMenu(4)}
                  className="group w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex items-center gap-4">
                    <HiOutlineOfficeBuilding className="text-xl text-gray-800" />
                    <span className="font-medium">Organización</span>
                  </span>
                  <RiArrowRightSLine
                    className={`${activeSubmenu === 4 ? "rotate-90 text-blue-700" : "text-gray-800 group-hover:text-blue-700"
                      } transition-transform`}
                  />
                </button>
                <ul
                  className={`mt-2 space-y-1 pl-8 overflow-hidden transition-all ${activeSubmenu === 4 ? "h-auto" : "h-0"
                    }`}
                >
                  <li>
                    <Link
                      to="/direcciones"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/direcciones"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Direcciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/unidades"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/unidades"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Unidades
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/cargos"
                      className={`block py-2 px-4 text-sm rounded-lg ${location.pathname === "/cargos"
                        ? "bg-gray-100 text-blue-700 shadow"
                        : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      Cargos
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Usuarios - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/configuraciones"
                  className={`w-full flex items-center gap-4 py-2 px-4 rounded-lg ${location.pathname === `/configuraciones`
                    ? "bg-gray-100 text-blue-700 shadow"
                    : "hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  <RiSettings3Line className={`text-xl ${location.pathname === `/configuraciones`
                    ? "text-blue-700"
                    : "text-gray-800 group-hover:text-blue-700"
                    }`} />
                  <span className="font-medium">Configuraciones</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Cerrar sesión */}
        {/* <nav className="p-4">
          <hr className="mb-4" />
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700"
          >
            <RiLogoutCircleRLine className="text-gray-800 text-xl group-hover:text-blue-700" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </nav> */}

      </div>
      {/* Botón para mostrar/ocultar el menú */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default Sidebar;
