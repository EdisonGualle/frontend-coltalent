import OptionsColumn from './OptionsColumn';


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
    Header: "Opciones",
    Cell: OptionsColumn,
  },
];