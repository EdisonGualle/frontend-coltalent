import { renderContractAssignmentPeriod } from "./renderContractAssignmentPeriod";
import { renderEmployeeIdentity } from "./renderEmployeeIdentity";


// Columnas que siempre estarán visibles y no se pueden ocultar
export const contractAssignmentFixedColumns = [
    {
        id: "employee.identification",
        label: "Empleado",
        render: renderEmployeeIdentity,
        autoWidth: true,
        order: 1,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const contractAssignmentVisibleColumns = [
    {
        id: "contract_type.name",
        label: "Contrato",
        autoWidth: true,
        order: 2,
    },
    {
        id: "start_date",
        label: "Vigenica del contrato",
        render: renderContractAssignmentPeriod,
        autoWidth: true,
        order: 3,
    },
    {
        id: "status",
        label: "Estado",
        order: 6,
    },
    {
        id: "employee.organization.position",
        label: "Cargo",
        autoWidth: true,
        order: 7,
    },
    
];

// Todas las columnas disponibles
export const contractAssignmentGeneralColumns = [
    {
        id: "vacation_balance",
        label: "Saldo de vacaciones",
        autoWidth: true,
        order: 4,
    },
    {
        id: "termination_reason",
        label: "Motivo de terminación",
        showIcon: true,
        modalTitle: "Motivo de terminación",
        modalConfig: [
            {
                key: "termination_reason",
                label: "Detalles",
            },
        ],
        order: 5,
    },
    {
        id: "employee.organization.unit",
        label: "Unidad",
        autoWidth: true,
        order: 8,
    },
    {
        id: "employee.organization.direction",
        label: "Dirección",
        autoWidth: true,
        order: 9,
    },
    ...contractAssignmentVisibleColumns,
];


// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
    { column: "status", label: "Estado" },
    { column: "employee.organization.unit", label: "Unidad" },
    { column: "employee.organization.direction", label: "Dirección" },
];