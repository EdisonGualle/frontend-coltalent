import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import {
  RiLogoutCircleRLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiUser3Line,
  RiDashboardLine,
  RiUserStarLine,
  RiSettings3Line,
  RiClipboardLine,
  RiArrowDropRightLine,
  RiShieldUserLine // Nuevo ícono para Permisos
} from "react-icons/ri";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const { logout, userRole, user } = useAuth();

  const navigate = useNavigate();

  const toggleSubMenu = (index) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate(`/perfil/${user.employee_id}/datos-personales`);
  };

  const handlePermisosClick = () => {
    navigate(`/permisos/${user.employee_id}/solicitar`);
  };

  return (
    <>
      <div
        className={`xl:h-[100vh] absolute overflow-y-scroll xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-gray-300  flex flex-col justify-between z-50  ${showMenu ? "left-0" : "-left-full"
          } transition-all`}
      >
        <div>
          <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-br-3xl shadow-md sticky top-0 z-10">
            <h1 className="text-2xl font-bold">COLTALENT</h1>
            <p className="text-sm opacity-75">Gestión Eficiente de RRHH</p>
          </div>

          {/* Menu */}
          <ul className="flex-1 space-y-2 px-4 py-8">

            {/* Separador */}
            <hr className="pb-2" />

            {/* Tablero */}
            <li className="group">
              <Link
                to="/"
                className="w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-600 hover:shadow-sm  transition-colors"
              >
                <RiDashboardLine className="text-gray-800 text-xl group-hover:text-blue-700" />
                <span className="font-medium">Tablero</span>
              </Link>
            </li>

            {/* Mi Perfil - Acceso Todos*/}
            <li className="group">
              <button
                onClick={handleProfileClick}
                className="w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm  transition-colors"
              >
                <RiUser3Line className="text-gray-800 text-xl group-hover:text-blue-700" />
                <span className="font-medium">Mi Perfil</span>
              </button>
            </li>

            {/* Empleados - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/empleados"
                  className="w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm  transition-colors"
                >
                  <RiUserStarLine className="text-gray-800 text-xl group-hover:text-blue-700" />
                  <span className="font-medium">Empleados</span>
                </Link>
              </li>
            )}

            {/* Usuarios - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/usuarios"
                  className="w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm  transition-colors"
                >
                  <RiUser3Line className="text-gray-800 text-xl group-hover:text-blue-700" />
                  <span className="font-medium">Usuarios</span>
                </Link>
              </li>
            )}

            {/* Permisos */}
            <li >
              <button
                onClick={() => toggleSubMenu(3)}
                className="group w-full flex text-gray-800 items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm transition-colors"
              >
                <span className="flex items-center gap-4">
                  <RiShieldUserLine className="text-gray-800 text-xl group-hover:text-blue-700" />{" "}
                  <span className="font-medium">Permisos</span>
                </span>
                <RiArrowRightSLine
                  className={`mt-1 ${activeSubmenu === 3 && "rotate-90"} transition-all`}
                />
              </button>

              {/* Solicitudes - Acceso Todos */}
              <ul
                className={`mt-2 space-y-1 pl-8 overflow-hidden transition-all ${activeSubmenu === 3 ? "h-auto" : "h-0"
                  }`}
              >
                <li>
                  <button
                    onClick={handlePermisosClick}
                    className="w-full flex items-start  py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
                  >
                    Solicitudes
                  </button>
                </li>

                {/* Autorizaciones - Acceso Administrador, Jefe Dirección, Jefe Unidad, Jefe General */}
                {(userRole === 'Administrador' || userRole === 'Jefe Dirección' || userRole === 'Jefe Unidad' || userRole === 'Jefe General') && (
                  <li>
                    <Link
                      to="/permisos/autorizaciones"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
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
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
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
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
                    >
                      Motivos de Rechazo
                    </Link>
                  </li>
                )}
              </ul>
            </li>

            {/* Organización - Acceso Administrador*/}
            {(userRole === 'Administrador') && (
              <li>
                <button
                  onClick={() => toggleSubMenu(1)}
                  className="group w-full flex text-gray-800 items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <HiOutlineOfficeBuilding className="text-gray-800 text-xl group-hover:text-blue-700" />{" "}
                    <span className="font-medium">Organización</span>
                  </span>
                  <RiArrowRightSLine
                    className={`mt-2 ${activeSubmenu === 1 && "rotate-90"} transition-all`}
                  />
                </button>
                <ul
                  className={`mt-2 space-y-1 pl-8 overflow-hidden transition-all ${activeSubmenu === 1 ? "h-auto" : "h-0"
                    }`}
                >

                  {/* Direcciones - Acceso Administrador */}
                  <li>
                    <Link
                      to="/direcciones"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
                    >
                      Direcciones
                    </Link>
                  </li>

                  {/* Unidades - Acceso Administrador */}
                  <li>
                    <Link
                      to="/unidades"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
                    >
                      Unidades
                    </Link>
                  </li>

                  {/* Cargos - Acceso Administrador */}
                  <li>
                    <Link
                      to="/cargos"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:text-blue-700 rounded-lg transition-all"
                    >
                      Cargos
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Configuraciones - Acceso Administrador */}
            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/configuraciones"
                  className="w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm  transition-colors"
                >
                  <RiSettings3Line className="text-gray-800 text-xl group-hover:text-blue-700" />
                  <span className="font-medium">Configuraciones</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <nav className="p-4">
          <hr className="mb-4" />
          <button onClick={handleLogout} className="group w-full flex text-gray-800 items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-blue-700 hover:shadow-sm  transition-colors">
            <RiLogoutCircleRLine className="text-gray-800 text-xl group-hover:text-blue-700" />
            <span className="font-medium">Cerrar sesión</span >
          </button>
        </nav>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default Sidebar;
