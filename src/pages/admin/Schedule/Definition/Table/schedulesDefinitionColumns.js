import { renderWorkHours } from "./renderWorkHours";
import { renderBreakHours } from "./renderBreakHours";
import { renderRestDays } from "./renderRestDays";

export const scheduleFixedColumns = [
  {
    id: "name",
    label: "Nombre del Horario",
    autoWidth: true,
    order: 1,
  },
];

export const scheduleVisibleColumns = [
  {
    id: "work_hours",
    label: "Horas de Trabajo",
    render: renderWorkHours,
    order: 2,
  },
  {
    id: "break_hours",
    label: "Periodo de Descanso",
    render: renderBreakHours,
    order: 3,
  },
  {
    id: "rest_days",
    label: "Días de Descanso",
    render: renderRestDays,
    order: 4,
  },
  {
    id: "weekly_hours",
    label: "Horas Semanales",
    order: 5,
  },
  {
    id: "status",
    label: "Estado",
    order: 6,
  },

];

export const scheduleGeneralColumns = [
  ...scheduleVisibleColumns,
];

export const dynamicFilterColumns = [
  { column: "status", label: "Estado" },
];