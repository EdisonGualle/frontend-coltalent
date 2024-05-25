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
    Header: "Genero",
    accessor: 'gender',
  },
  {
    Header: "Estado Civil",
    accessor: 'marital_status',
  },
  {
    Header: "Celular",
    accessor: 'contact.personal_phone',
  },
  {
    Header: "Correo",
    accessor: 'contact.personal_email',
  },
  {
    Header: "Cargo",
    accessor: 'position.name',
  },
];