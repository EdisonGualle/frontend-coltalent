import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';

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
];