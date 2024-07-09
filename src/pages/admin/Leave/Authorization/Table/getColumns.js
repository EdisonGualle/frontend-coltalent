import { adminColumns, jefeDireccionColumns } from "./authorizationColumns";

export const getColumns = (role, filter) => {
  switch (role) {
    case "Administrador":
      return adminColumns[filter] ||  adminColumns.pendientes;
    case "Jefe Dirección":
      return jefeDireccionColumns[filter] || jefeDireccionColumns.pendientes;
    case "Jefe Unidad":
      return jefeDireccionColumns[filter] || jefeDireccionColumns.pendientes;
    case "Jefe General":
      return jefeDireccionColumns[filter] || jefeDireccionColumns.pendientes;
    default:
      return [];
  }
};
