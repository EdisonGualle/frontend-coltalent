import { renderContractTypeDuration } from "./renderContractTypeDuration";
import { renderContractTypeVacationDetails } from "./renderContractTypeVacationDetails";
import { renderContractTypeWeeklyHours } from "./renderContractTypeWeeklyHours";

// Columnas que siempre estarán visibles y no se pueden ocultar]
export const contractTypesFixedColumns = [
    {
        id: "name",
        label: "Nombre",
        autoWidth: true,
        order: 1,
    },
    {
        id: "description",
        label: "Descripción",
        order: 2,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const contractTypesVisibleColumns = [
    {
        id: "contract_type_duration",
        label: "Duración",
        render: renderContractTypeDuration,
        autoWidth: true,
        order: 3,
    },
    {
        id: "vacations",
        label: "Vacaciones",
        render: renderContractTypeVacationDetails,
        autoWidth: true,
        order: 4, 
    },

    {
        id: "weekly_hours",
        label: "Jornada Semanal",
        render: renderContractTypeWeeklyHours,
        sstyle: { minWidth: '150px' },
        order: 5,
    },
    {
        id: "status",
        label: "Estado",
        order: 6,
    },
];

// Todas las columnas disponibles
export const contractTypesGeneralColumns = [
    ...contractTypesVisibleColumns,
];


// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
    { column: "status", label: "Estado" },
    { column: "renewable", label: "Renovable" },
];