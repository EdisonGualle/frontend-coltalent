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
        className={`xl:h-[100vh] absolute overflow-y-scroll xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-900 p-4 flex flex-col justify-between z-50  ${showMenu ? "left-0" : "-left-full"
          } transition-all`}
      >
        <div>
          <h1 className="text-center text-2xl font-bold text-primary mb-10">
            COLTALENT<span className="text-secondary-100 text-4xl">.</span>
          </h1>
          <ul>
            <li className="group">
              <Link
                to=""
                className="flex text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
              >
                <RiDashboardLine className="text-primary text-xl group-hover:text-yellow-500" /> Tablero
              </Link>
            </li>

            {/* Todos */}
            <li className="group">
              <button
                onClick={handleProfileClick}
                className=" w-full flex text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
              >
                <RiUser3Line className="text-primary text-xl group-hover:text-yellow-500" /> Mi Perfil
              </button>
            </li>


            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/empleados"
                  className="flex text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
                >
                  <RiUserStarLine className="text-primary text-xl group-hover:text-yellow-500" /> Empleados
                </Link>
              </li>
            )}


            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/usuarios"
                  className="flex text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
                >
                  <RiUser3Line className="text-primary text-xl group-hover:text-yellow-500" /> Usuarios
                </Link>
              </li>
            )}


            <li className="group">
              <button
                onClick={() => toggleSubMenu(3)}
                className="w-full flex text-secondary-100 items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
              >
                <span className="flex items-center gap-4">
                  <RiShieldUserLine className="text-primary text-xl group-hover:text-yellow-500" />{" "}
                  Permisos
                </span>
                <RiArrowRightSLine
                  className={`mt-1 ${activeSubmenu === 3 && "rotate-90"} transition-all`}
                />
              </button>
              <ul
                className={` ${activeSubmenu === 3 ? "h-auto" : "h-0"} overflow-y-hidden transition-all`}
              >
                <li>
                  <button
                     onClick={handlePermisosClick}
                    className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                  >
                    <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                    Solicitudes
                  </button>
                </li>
                {(userRole === 'Administrador' || userRole === 'Jefe Dirección' || userRole === 'Jefe Unidad' || userRole === 'Jefe General') && (
                  <li>
                    <Link
                      to="/permisos/autorizaciones"
                      className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                    >
                      <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                      Autorizaciones
                    </Link>
                  </li>
                )}
                  {(userRole === 'Administrador') && (
                <li>
                  <Link
                    to="/permisos/tipos"
                    className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                  >
                    <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                    Tipos de Permisos
                  </Link>
                </li>
                )}
                  {(userRole === 'Administrador') && (
                <li>
                  <Link
                    to="/permisos/motivos-rechazo"
                    className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                  >
                    <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                    Motivos de Rechazo
                  </Link>
                </li>
                )}
              </ul>
            </li>
            {(userRole === 'Administrador' ) && (
              <li className="group">
                <button
                  onClick={() => toggleSubMenu(1)}
                  className="w-full flex text-secondary-100 items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <HiOutlineOfficeBuilding className="text-primary text-xl group-hover:text-yellow-500" />{" "}
                    Organización
                  </span>
                  <RiArrowRightSLine
                    className={`mt-1 ${activeSubmenu === 1 && "rotate-90"} transition-all`}
                  />
                </button>
                <ul
                  className={` ${activeSubmenu === 1 ? "h-auto" : "h-0"} overflow-y-hidden transition-all`}
                >
                  <li>
                    <Link
                      to="/direcciones"
                      className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                    >
                      <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                      Direcciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/unidades"
                      className="flex items-center gap-2 py-1 text-secondary-100 px-4 ps-7 ml-6  relative hover:text-primary transition-colors"
                    >
                      <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                      Unidades
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cargos"
                      className="flex items-center gap-2 py-1 text-secondary-100 px-4 ml-6  relative hover:text-primary transition-colors"
                    >
                      <RiArrowDropRightLine className="text-primary text-xl group-hover:text-yellow-500 inline-block" />
                      Cargos
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {(userRole === 'Administrador') && (
              <li className="group">
                <Link
                  to="/configuraciones"
                  className="flex text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors"
                >
                  <RiSettings3Line className="text-primary text-xl group-hover:text-yellow-500" />
                  Configuraciones
                </Link>
              </li>
            )}
          </ul>
        </div>
        <nav className="group">
          <button onClick={handleLogout} className="flex w-full text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100 hover:text-black transition-colors">
            <RiLogoutCircleRLine className="text-primary text-xl group-hover:text-yellow-500" /> Cerrar
            sesión
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
