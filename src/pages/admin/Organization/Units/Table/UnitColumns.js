export const unitColumnsFixed = [
  {
    id: 'name',
    label: 'Nombre',
    order: 1,
  },
  {
    id: 'status',
    label: 'Estado',
    order: 6,
  },
];

export const unitColumnsVisible = [
  {
    id: 'function',
    label: 'Función',
    order: 2,
  },
  {
    id: 'direction.name',
    label: 'Dirección',
    order: 5,
    autoWidth: true,
  },
];

export const unitColumnsGeneral = [
  ...unitColumnsVisible,
  {
    id: 'phone',
    label: 'Teléfono',
    order: 3,
  },
  {
    id: 'manager.name',
    label: 'Jefe',
    order: 4,
    autoWidth: true,
  },
];

export const unitColumnsFilters = [
  {
    id: 'direction.name',
    label: 'Dirección',
    autoWidth: true,
  },
  {
    id: 'status',
    label: 'Estado',
  },
];