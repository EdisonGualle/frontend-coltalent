// Columnas que siempre estarán visibles y no se pueden ocultar
export const delegatedFixedColumns = [
  {
    id: "reason",
    label: "Razón",
  },
  {
    id: "status",
    label: "Estado",
  },
];

// Columnas visibles al inicio (modificables por el usuario)
export const delegatedVisibleColumns = [
  {
    id: "delegated_by.decision_date",
    label: "Fecha Decisión",
    autoWidth: true,
  },
  {
    id: "original_leave.start_date",
    label: "Inicio Permiso",
  },
  {
    id: "original_leave.end_date",
    label: "Fin Permiso",
  },
];

// Todas las columnas disponibles
export const delegatedGeneralColumns = [
  ...delegatedVisibleColumns,
  {
    id: "original_leave.requested_by.id",
    label: "id",
  },
];

// Filtros manuales: configurados explícitamente con opciones predeterminadas
export const manualFiltersConfig = [
  {
    column: "status",
    label: "Estado",
    options: [
      { value: "Aprobado", label: "Aprobado" },
      { value: "Pendiente", label: "Pendiente" },
      { value: "Rechazado", label: "Rechazado" },
    ],
  },
];

// Columnas para filtros dinámicos: el sistema generará las opciones automáticamente
export const dynamicFilterColumns = ["status"];
