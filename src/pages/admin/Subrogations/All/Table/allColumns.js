import { renderDelegationPeriod } from "./renderDelegationPeriod";
import { renderDecisionDate } from "./renderDecisionDate.jsx";

// Columnas que siempre estarán visibles y no se pueden ocultar
export const allFixedColumns = [
  {
    id: "delegated_by.full_name",
    label: "Delegado por",
    autoWidth: true,
    order: 1,
    exportable: true,
  },
  {
    id: "delegated_to.full_name",
    label: "Delegado a",
    autoWidth: true,
    order: 2,
    exportable: true,
  },
  {
    id: "original_leave.requested_by.full_name", 
    label: "Titular Subrogado",
    autoWidth: true,
    order: 3,
    exportable: true,
  },
  {
    id: "decision_date",
    label: "Fecha de Decisión",
    render: renderDecisionDate,
    autoWidth: true,
    order: 8,
    exportable: true,
  },
  {
    id: "original_leave.start_date",
    label: "Periodo de Subrogación",
    render: renderDelegationPeriod,
    filterType: "combinedDateRange",
    autoWidth: true,
    order: 9,
    exportable: true,
  },
  {
    id: "status",
    label: "Estado",
    autoWidth: true,
    order: 10,
    exportable: true,
  },
];

// Columnas visibles al inicio (modificables por el usuario)
export const allVisibleColumns = [
  {
    id: "responsibilities",
    label: "Responsabilidades Delegadas",
    showIcon: true,
    modalTitle: "Responsabilidades",
    modalConfig: [
      {
        key: "delegated_to.responsibilities",
        label: "Lista de responsabilidades delegadas",
      },
    ],
    order: 7,
    exportable: false,
  },
];

// Todas las columnas disponibles
export const allGeneralColumns = [
  ...allVisibleColumns,
  {
    id: "reason",
    label: "Motivo de la Delegación",
    autoWidth: true,
    order: 6,
    exportable: true,
  },
  {
    id: "delegated_to.position.name",
    label: "Cargo del Delegado",
    autoWidth: true,
    order: 4,
    exportable: true,
  },
  {
    id: "original_leave.requested_by.position.name", 
    label: "Cargo del Titular",
    autoWidth: true,
    order: 5,
    exportable: true,
  },
  {
    id: "original_leave.requested_by.position.unit", 
    label: "Unidad",
    autoWidth: true,
    order: 11,
    exportable: true,
  },
  {
    id: "original_leave.requested_by.position.direction", 
    label: "Dirección",
    autoWidth: true,
    order: 12,
    exportable: true,
  },
];



// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [
  { column: "status", label: "Estado" },
  { column: "original_leave.requested_by.position.unit", label: "Unidad" },
  { column: "original_leave.requested_by.position.direction", label: "Dirección" },
];
