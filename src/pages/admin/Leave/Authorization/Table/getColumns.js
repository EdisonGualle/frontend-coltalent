import { adminColumns, jefeDireccionColumns } from "./authorizationColumns";

export const getColumns = (role, filter) => {
  switch (role) {
    case "Administrador":
      return adminColumns[filter] ||  adminColumns.pendientes;
    case "Jefe Dirección":
      return adminColumns[filter] ||  adminColumns.pendientes;
    case "Jefe Unidad":
      return adminColumns[filter] ||  adminColumns.pendientes;
    case "Jefe General":
      return adminColumns[filter] ||  adminColumns.pendientes;
    default:
      return [];
  }
};
