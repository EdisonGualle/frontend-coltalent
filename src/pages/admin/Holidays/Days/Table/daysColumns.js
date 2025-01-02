import { renderDaysDetails } from "./renderDaysDetails";

// Columnas que siempre estarán visibles y no se pueden ocultar]
export const daysFixedColumns = [
    {
        id: "name",
        label: "Nombre",
        order: 1,
    },
    {
        id: "date",
        label: "Fecha",
        order: 2,
    },
];

// Columnas visibles al inicio (modificables por el usuario)
export const daysVisibleColumns = [
    {
        id: "details",
        label: "Características",
        render: renderDaysDetails,
        order: 3, 
    },
];

// Todas las columnas disponibles
export const daysGeneralColumns = [
    ...daysVisibleColumns,
];

