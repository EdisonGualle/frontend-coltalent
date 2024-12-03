import { renderRequestedPeriod } from "../Authorization/Table/requestedPeriod";

const historyColumns = {
  pendientes: [
    { id: "created_at", label: "Fecha de solicitud", },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  aprobados: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  rechazados: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  historial: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
};

export default historyColumns;