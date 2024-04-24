import OptionsColumn from './OptionsColumn';
import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';

export const positionColumns = [
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
    Header: "Opciones",
    Cell: (props) => <OptionsColumn positionId={props.row.original.id} />,
  },
];