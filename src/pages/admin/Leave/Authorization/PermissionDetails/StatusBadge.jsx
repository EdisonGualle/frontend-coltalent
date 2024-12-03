import React from 'react';

const statusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }) => {
    return (
        <span
            className={`px-3 py-1 ml-3 rounded-lg text-sm font-medium ${statusColors[status.toLowerCase()]}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;