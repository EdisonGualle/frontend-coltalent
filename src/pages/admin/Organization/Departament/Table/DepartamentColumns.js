import { AvatarCell } from '../../../../../components/Table/AvatarCell';

export const DepartamentColumns = [
  {
    Header: "Nombre",
    accessor: 'name',
  },
  {
    Header: "Función",
    accessor: 'function',
  },
  {
    Header: "Jefe de Dirección",
    accessor: 'manager.name',
    Cell: AvatarCell,
    imgAccessor: 'manager.photo',
  },
];