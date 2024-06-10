import { AvatarCell } from '../../../../../components/Table/AvatarCell';
import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';

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
    accessor: 'direction.name',
    Filter: SelectColumnFilter,  
  },
  {
    Header: "Jefe de Unidad",
    accessor: 'manager.name',
    Cell: AvatarCell,
    imgAccessor: "manager.photo",
  },
];