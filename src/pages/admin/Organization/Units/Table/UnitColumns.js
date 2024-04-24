import OptionsColumn from './OptionsColumn';
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
    Header: "Departamento",
    accessor: 'department.name',
    Filter: SelectColumnFilter,  
  },
  {
    Header: "Jefe",
    accessor: 'head_employee_full_name',
    Cell: AvatarCell,
    imgAccessor: "head_employee_photo",
  },
  {
    Header: "Opciones",
    Cell: OptionsColumn,
  },
];