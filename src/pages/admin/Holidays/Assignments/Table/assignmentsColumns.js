import { renderEmployeeIdentity } from "./renderEmployeeIdentity";
import { renderHolidayDetails } from "./renderHolidayDetails";

// Columnas que siempre estarán visibles y no se pueden ocultar]
export const assignmentsFixedColumns = [

    {
        id: "employee.identification",
        label: "Empleado",
        render: renderEmployeeIdentity,
        autoWidth: true,
        order: 1,
    },
    {
        id: "holiday.name",
        label: "Día festivo",
        autoWidth: true,
        order: 3,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const assignmentsVisibleColumns = [
    {
        id: "holiday.info",
        label: "Detalles del Día Festivo",
        render: renderHolidayDetails,
        order: 4,
        autoWidth: true,
    },
    {
        id: "employee.organization.position",
        label: "Cargo",
        autoWidth: true,
        order: 2,
    },
];

// Todas las columnas disponibles
export const assignmentsGeneralColumns = [
    ...assignmentsVisibleColumns,
    {
        id: "employee.organization.unit",
        label: "Unidad",
        autoWidth: true,
        order: 5,
    },
    {
        id: "employee.organization.direction",
        label: "Dirección",
        autoWidth: true,
        order: 6,
    },
];


// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
    { column: "employee.organization.unit", label: "Unidad" },
    { column: "employee.organization.direction", label: "Dirección" },
];