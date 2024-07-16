import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';
import { StatusPill } from '../../../../../components/Table/StatusPill';

export const PositionColumns = [
  {
    Header: "Nombre",
    accessor: 'name',
  },
  {
    Header: "Función",
    accessor: 'function',
  },
  {
    Header: "Unidad",
    accessor: 'unit.name',
    Filter: SelectColumnFilter,  
  },
  {
    Header: "Dirección",
    accessor: 'direction.name',
    Filter: SelectColumnFilter,  
  },
  {
    Header: "Estado",
    accessor: 'status',
    Cell: StatusPill,
    Filter: SelectColumnFilter,
  },
];