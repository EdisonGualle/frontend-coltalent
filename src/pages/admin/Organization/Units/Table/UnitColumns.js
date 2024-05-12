import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';
import { AvatarCell } from './AvatarCell';


export const UnitColumns = [
  {
    Header: "Nombre",
    accessor: 'name',
  },
  {
    Header: "Función",
    accessor: 'function',
  },
  {
    Header: "Teléfono",
    accessor: 'phone',
  },
  {
    Header: "Dirección",
    accessor: 'department.name',
    Filter: SelectColumnFilter,  
  },
  {
    Header: "Jefe de Unidad",
    accessor: 'head_employee_name',
    Cell: AvatarCell,
    imgAccessor: "head_employee_photo",
  },
];