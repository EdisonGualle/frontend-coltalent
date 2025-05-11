export const positionColumnsFixed = [
  {
    id: 'name',
    label: 'Nombre',
    order: 1,
  },
  {
    id: "function",
    label: 'Función',
    order: 2,
  },
  {
    id: 'status',
    label: 'Estado',
    order: 6,
  },
];

export const positionColumnsVisible = [
  {
    id: 'unit.name',
    label: 'Unidad',
    order: 3,
  },
  {
    id: 'direction.name',
    label: 'Dirección',
    order: 4,
  },
];

export const positionColumnsGeneral = [
  ...positionColumnsVisible,
  {
    id: "responsibilities",
    label: "Responsabilidades",
    showIcon: true,
    modalTitle: "Responsabilidades",
    modalConfig: [
      {
        key: "responsibilities",
        label: "Lista",
      },
    ],
    order: 5,
    exportable: false,
  },
];

export const positionColumnsFilters = [
  {
    id: 'unit.name',
    label: 'Unidad',
  },
  {
    id: 'direction.name',
    label: 'Dirección',
  },
  {
    id: 'status',
    label: 'Estado',
  },
];