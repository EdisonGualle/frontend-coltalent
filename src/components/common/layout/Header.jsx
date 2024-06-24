import React from "react";
import { useAuth } from "../../../hooks/useAuth";

import {
  RiArrowDownSLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (

    <header className="h-[7vh] md:h-[10vh] border-b border-secondary-100 p-8 flex items-center justify-end bg-gray-800">
      <nav className="flex items-center gap-2">
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 p-2 rounded-lg transition-colors hover:bg-secondary-100 group">
              <img
                src={`${import.meta.env.VITE_STORAGE_URL}/${user.photo}`}
                className="w-6 h-6 object-cover rounded-full"
              />
              {user && user.employee_name ? (
                <span className="text-secondary-100 group-hover:text-black">
                  {user.employee_name}
                </span>
              ) : (
                <span className="text-secondary-100 group-hover:text-black">
                  Usuario
                </span>
              )}
              <RiArrowDownSLine className="text-secondary-100 group-hover:text-black" />
            </MenuButton>
          }
          align="end"
          arrow
          arrowClassName="bg-gray-300"
          transition
          menuClassName="bg-gray-300 p-4"
        >
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to={`/perfil/${user.employee_id}`}
              className="rounded-lg transition-colors  hover:bg-secondary-50  flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <img
                src={`${import.meta.env.VITE_STORAGE_URL}/${user.photo}`}
                className="w-8 h-8 object-cover rounded-full"
              />
              <div className="flex flex-col text-sm">
                {user && user.employee_name ? (
                  <span className="text-sm">{user.employee_name}</span>
                ) : (
                  <span className="text-sm">Usuario</span>
                )}
                {user && user.email ? (
                  <span className="text-xs text-gray-600">{user.email}</span>
                ) : (
                  <span className="text-xs text-gray-600">correo@test.com</span>
                )}
              </div>
            </Link>
          </MenuItem>
          <hr className="my-4 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/perfil/configuracion"
              className="rounded-lg transition-colors  hover:bg-secondary-50 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <RiSettings3Line /> Configuración
            </Link>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="#"
              className="rounded-lg transition-colors  hover:bg-secondary-50 flex items-center gap-x-4 py-2 px-6 flex-1"
              onClick={handleLogout}
            >
              <RiLogoutCircleRLine /> Cerrar sesión
            </Link>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Header;
