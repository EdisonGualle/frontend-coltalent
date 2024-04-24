import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';
import { StatusPill } from '../../../../../components/Table/StatusPill';
import { AvatarCell } from './AvatarCell';
import OptionsColumn from './OptionsColumn';
export const EmployeeColumns = [
  {
    Header: "Name",
    accessor: 'name',
    Cell: AvatarCell,
    imgAccessor: "imgUrl",
    emailAccessor: "email",
  },
  {
    Header: "Title",
    accessor: 'title',
  },
  {
    Header: "Status",
    accessor: 'status',
    Cell: StatusPill,
    Filter: SelectColumnFilter,  
    filter: 'includes',
  },
  {
    Header: "Age",
    accessor: 'age',
  },
  {
    Header: "Role",
    accessor: 'role',
    Filter: SelectColumnFilter,  
    filter: 'includes',
  },
  {
    Header: "Options",
    Cell: (props) => <OptionsColumn employeeId={props.row.original.id} />,
  },
];