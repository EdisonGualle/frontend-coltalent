import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';
import { StatusPill } from '../../../../../components/Table/StatusPill';
import { AvatarCell } from './AvatarCell';

export const UserColumns = [
  {
    Header: "Usuario",
    accessor: 'name',
    Cell: AvatarCell,
    imgAccessor: "photo",
    emailAccessor: "email",
  },
  {
    Header: "Empleado",
    accessor: 'employee_full_name',
  },
  {
    Header: "Estado",
    accessor: 'user_state.name',
    Cell: StatusPill,
    Filter: SelectColumnFilter,
  },
  {
    Header: "Rol",
    accessor: 'role.name',
    Filter: SelectColumnFilter,
  },
];