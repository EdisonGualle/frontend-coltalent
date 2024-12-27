import { renderEmployeeIdentity } from "./renderEmployeeIdentity";
import { renderSchedulePeriod } from "./renderSchedulePeriod";


// Columnas que siempre estarán visibles y no se pueden ocultar
export const assignmentFixedColumns = [
    {
        id: "employee",
        label: "Empleado", 
        render: renderEmployeeIdentity, 
        autoWidth: true,
        order: 1, 
    },    
    {
        id: "schedule.name",
        label: "Horario",
        autoWidth: true,
        order: 5,
    },
    {
        id: "schedule_period",
        label: "Vigencia del Horario", 
        render: renderSchedulePeriod,
        autoWidth: true,
        order: 6,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const assignmentVisibleColumns = [
    {
        id: "employee.organization.position",
        label: "Cargo",
        autoWidth: true,
        order: 2,
    },
    {
        id: "status",
        label: "Estado",
        order: 7,
    },
];

// Todas las columnas disponibles
export const assignmentGeneralColumns = [
    {
        id: "employee.organization.unit",
        label: "Unidad",
        autoWidth: true,
        order: 3,
    },
    {
        id: "employee.organization.direction",
        label: "Dirección",
        autoWidth: true,
        order: 4,
    },
    ...assignmentVisibleColumns,
];

// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
    { column: "status", label: "Estado" },
    { column: "employee.organization.unit", label: "Unidad" },
    { column: "employee.organization.direction", label: "Dirección" },
];
