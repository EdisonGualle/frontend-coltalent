import { adminColumns, adminFilters} from "./authorizationColumns";

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

export const getFilters = (role, filter) => {
  switch (role) {
    case "Administrador":
      return adminFilters[filter] || adminFilters.pendientes;
    case "Jefe Dirección":
      return adminFilters[filter] || adminFilters.pendientes;
    case "Jefe Unidad":
      return adminFilters[filter] || adminFilters.pendientes;
    case "Jefe General":
      return adminFilters[filter] || adminFilters.pendientes;
    default:
      return [];
  }
};