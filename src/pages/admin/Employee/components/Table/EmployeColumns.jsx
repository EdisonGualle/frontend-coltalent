import { SelectColumnFilter } from '../../../../../components/Table/SelectColumnFilter';
import { AvatarCell } from './AvatarCell';
export const EmployeeColumns = [
  {
    Header: "Nombres y Apellidos",
    accessor: 'full_name',
    Cell: AvatarCell,
    imgAccessor: "photo",
    identification: "identification",
  },
  {
    Header: "Fecha de Nacimiento",
    accessor: 'date_of_birth',
  },
  {
    Header: "Genero",
    accessor: 'gender',
  },
  {
    Header: "Celular Personal",
    accessor: 'contact.personal_phone',
  },
  {
    Header: "Correo Personal",
    accessor: 'contact.personal_email',
  },
  {
    Header: "Cargo",
    accessor: 'position.name',
  },
];