import { renderDelegationPeriod } from "./renderDelegationPeriod";
import { renderDecisionDate } from "./renderDecisionDate.jsx";

// Columnas que siempre estarán visibles y no se pueden ocultar
export const assignedFixedColumns = [
  {
    id: "delegated_by.full_name",
    label: "Asignado Por",
    autoWidth: true,
    order: 1,
    exportable: true,
  },
  {
    id: "delegated_by.decision_date",
    label: "Fecha de Decisión",
    render: renderDecisionDate,
    autoWidth: true,
    order: 4,
    exportable: true,
  },
  {
    id: "delegation_period",
    label: "Periodo de Subrogación",
    render: renderDelegationPeriod,
    filterType: "combinedDateRange",
    order: 5,
    exportable: true,
  },
  {
    id: "status",
    label: "Estado",
    order: 7,
    exportable: true,
    autoWidth: true,
  },
];

// Columnas visibles al inicio (modificables por el usuario)
export const assignedVisibleColumns = [
  {
    id: "responsibilities",
    label: "Responsabilidades Asignadas",
    showIcon: true,
    modalTitle: "Responsabilidades",
    modalConfig: [
      {
        key: "responsibilities",
        label: "Lista de responsabilidades asignadas",
      },
    ],
    order: 3,
    exportable: false,
  },
];

// Todas las columnas disponibles
export const assignedGeneralColumns = [
  ...assignedVisibleColumns,
  {
    id: "original_leave.requested_by.full_name",
    label: "Titular del Puesto:",
    autoWidth: true,
    order: 6,
    exportable: true,
  },

  {
    id: "reason",
    label: "Motivo de Subrogación",
    autoWidth: true,
    order: 2,
    exportable: false,
  },
];

// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = [{ column: "status", label: "Estado" }];
