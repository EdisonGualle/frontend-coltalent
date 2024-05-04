import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
// Icons
import {
  RiLogoutCircleRLine,
  RiArrowRightSLine,
  RiMenu3Line,
  RiCloseLine,
  RiUser3Line,
  RiDashboardLine,
  RiUserStarLine,
  RiSettings3Line,
} from "react-icons/ri";

import { HiOutlineOfficeBuilding } from "react-icons/hi";


const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSubmenus, setActiveSubmenus] = useState([]);
  const { logout, userRole } = useAuth();;
  const toggleSubMenu = (index) => {
    setActiveSubmenus((prevSubmenus) => {
      if (prevSubmenus.includes(index)) {
        return prevSubmenus.filter((item) => item !== index);
      } else {
        return [...prevSubmenus, index];
      }
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div
        className={`xl:h-[100vh] absolute overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-secondary-900 p-4 flex flex-col justify-between z-50  ${showMenu ? "left-0" : "-left-full"
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
                className="flex text-secondary-100  items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100   hover:text-black transition-colors"
              >
                <RiDashboardLine className="text-primary text-xl group-hover:text-yellow-500" /> Dashboard
              </Link>
            </li>

            {/* Mi Perfil */}
            {(userRole === 'administrador' || userRole === 'superadministrador'|| userRole === 'empleado') && (
            <li className="group">
              <Link
                to=""
                className="flex  text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100   hover:text-black transition-colors"
              >
                <RiUser3Line className="text-primary text-xl group-hover:text-yellow-500" /> Mi Perfil
              </Link>
            </li>
            )}

            {/* Empleados */}
            {(userRole === 'administrador' || userRole === 'superadministrador') && (
              <li className="group">
                <Link
                  to="/empleados"
                  className="flex  text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100   hover:text-black transition-colors"
                >
                  <RiUserStarLine className="text-primary text-xl group-hover:text-yellow-500" /> Empleados
                </Link>
              </li>
            )}
            {/* Usuarios */}
            {(userRole === 'administrador' || userRole === 'superadministrador') && (
            <li className="group">
              <Link
                to="/usuarios"
                className="flex  text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100  hover:text-black transition-colors"
              >
                <RiUser3Line className="text-primary text-xl group-hover:text-yellow-500" /> Usuarios
              </Link>
            </li>
            )}
            {/* Información de la Empresa */}
            {(userRole === 'administrador' || userRole === 'superadministrador') && (
            <li className="group">
              <button
                onClick={() => toggleSubMenu(1)}
                className="w-full flex text-secondary-100 items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary-100    hover:text-black transition-colors"
              >
                <span className="flex items-center gap-4">
                  <HiOutlineOfficeBuilding className="text-primary text-xl group-hover:text-yellow-500" />{" "}
                  Empresa
                </span>
                <RiArrowRightSLine
                  className={`mt-1 ${activeSubmenus.includes(1) && "rotate-90"
                    } transition-all`}
                />
              </button>
              <ul
                className={` ${activeSubmenus.includes(1) ? "h-[110px]" : "h-0"
                  } overflow-y-hidden transition-all`}
              >
                <li >
                  <Link
                    to="/departamentos"
                    className="py-2 text-secondary-100 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-primary transition-colors"
                  >
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/unidades"
                    className="py-2   text-secondary-100 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-gray-500 before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-primary transition-colors"
                  >
                    Unidades
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cargos"
                    className="py-2   text-secondary-100 px-4 border-l border-gray-500 ml-6 block relative before:w-3 before:h-3 before:absolute before:bg-gray-500 before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary-100 hover:text-primary transition-colors"
                  >
                    Cargos
                  </Link>
                </li>
              </ul>
            </li>
            )}
            {/* Configuraciones */}
            {(userRole === 'administrador' || userRole === 'superadministrador') && (
            <li className="group">
              <Link
                to=""
                className="flex  text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100   hover:text-black transition-colors"
              >
                <RiSettings3Line className="text-primary text-xl group-hover:text-yellow-500" />
                Configuraciones
              </Link>
            </li>
            )}
          </ul>
        </div>
        <nav className="group">
          <button onClick={handleLogout} className="flex  w-full text-secondary-100 items-center gap-4 py-2 px-4 rounded-lg hover:bg-secondary-100   hover:text-black transition-colors">
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
