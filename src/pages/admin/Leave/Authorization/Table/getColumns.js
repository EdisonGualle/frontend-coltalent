import { adminColumns } from "./authorizationColumns";

export const getColumns = (role, filter) => {
    if (role === 'Administrador') {
        return adminColumns[filter] || adminColumns.default;
    } 
    // Agregar más roles si es necesario
    return [];
};