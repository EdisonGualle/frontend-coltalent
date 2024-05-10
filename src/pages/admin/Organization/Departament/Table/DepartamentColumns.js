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
    accessor: 'head_employee_name',
    Cell: AvatarCell,
    imgAccessor: "head_employee_photo",
  },
];