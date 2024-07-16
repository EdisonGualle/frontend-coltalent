import { AvatarCell } from '../../../../../components/Table/AvatarCell';
import { StatusPill } from '../../../../../components/Table/StatusPill';
import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';

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
  {
    Header: "Estado",
    accessor: 'status',
    Cell: StatusPill,
    Filter: SelectColumnFilter,
  },
];