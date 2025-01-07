import { renderLeaveTypes } from "./renderLeaveTypes";

const rejectionReasonColumns = [
    { id: 'reason', label: 'Razón de rechazo' },
    {
        id: "leave_types",
        label: "Tipos de Permiso",
        render: renderLeaveTypes,
    },

    { id: 'status', label: 'Estado' }
];

export default rejectionReasonColumns;