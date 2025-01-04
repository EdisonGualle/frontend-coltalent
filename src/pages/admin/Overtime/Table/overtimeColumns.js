import { renderEmployeeIdentity } from "./renderEmployeeIdentity";
import { renderGeneratesCompensatory } from "./renderGeneratesCompensatory";
import { renderWorkSchedule } from "./renderWorkSchedule";

// Columnas que siempre estarán visibles y no se pueden ocultar]
export const overtimeFixedColumns = [
    {
        id: "employee.identification",
        label: "Empleado",
        render: renderEmployeeIdentity,
        autoWidth: true,
        order: 1,
    },
    {
        id: "day_type",
        label: "Tipo",
        autoWidth: true,
        order: 2,
    },
    {
        id: "date",
        label: "Fecha",
        autoWidth: true,
        order: 3,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const overtimeVisibleColumns = [
    {
        id: "work_schedule",
        label: "Horario",
        render: renderWorkSchedule,
        autoWidth: true,
        order: 4,
    },
    {
        id: "worked_value",
        label: "Horas trabajadas",
        autoWidth: true,
        order: 6,
    },
    {
        id: "generates_compensatory",
        label: "Genera compensatorio",
        render: renderGeneratesCompensatory,
        autoWidth: true,
        order: 7,
    },
];

// Todas las columnas disponibles
export const overtimeGeneralColumns = [
    {
        id: "reason",
        label: "Motivo",
        showIcon: true,
        modalTitle: "Detalles del Motivo",
        modalConfig: [
            {
                key: "reason",
                label: "Descripción",
            },
        ],
        order: 5,
    },
    {
        id: "employee.organization.position",
        label: "Cargo",
        autoWidth: true,
        order: 8,
    },
    {
        id: "employee.organization.unit",
        label: "Unidad",
        autoWidth: true,
        order: 9,
    },
    {
        id: "employee.organization.direction",
        label: "Dirección",
        autoWidth: true,
        order: 10,
    },
    ...overtimeVisibleColumns,
];


// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
    { column: "day_type", label: "Tipo" },
    { column: "employee.organization.unit", label: "Unidad" },
    { column: "employee.organization.direction", label: "Dirección" },
];