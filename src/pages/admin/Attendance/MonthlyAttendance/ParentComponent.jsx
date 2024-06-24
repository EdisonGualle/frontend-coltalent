import React from 'react';
import AttendanceTable from './AttendanceTable';
import { RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
const ParentComponent = () => {
    const handleEdit = (id) => {
        // Lógica para editar
        console.log(`Editar: ${id}`);
    };

    const handleDelete = (id) => {
        // Lógica para eliminar
        console.log(`Eliminar: ${id}`);
    };

    const handleView = (id) => {
        // Lógica para ver
        console.log(`Ver: ${id}`);
    };

    const handleAddNew = () => {
        // Lógica para agregar nuevo
        console.log('Agregar nuevo');
    };

    const actions = [
        {
            label: 'Edit',
            icon: <RiEdit2Line className="text-green-600" />,
            onClick: handleEdit,
            className: 'bg-green-100 hover:bg-green-200',
        },
        {
            label: 'View',
            icon: <RiEyeLine className="text-gray-600" />,
            onClick: handleView,
            className: 'bg-gray-100 hover:bg-gray-200',
        },
    ];

    const allColumns = [
        { id: 'id', label: 'ID' },
        { id: 'name', label: 'Name' },
        { id: 'date', label: 'Date' },
        { id: 'status', label: 'Status' },
        { id: 'department', label: 'Department' },
        { id: 'role', label: 'Role' },
        { id: 'hiddenColumn', label: 'Hidden Column' },
    ];

    const initialColumns = [
        { id: 'name', label: 'Name' },
        { id: 'date', label: 'Date' },
        { id: 'status', label: 'Status' },
        { id: 'department', label: 'Department' },
        { id: 'role', label: 'Role' },
    ];

    const initialData = [
        { id: 1, name: 'John Doe', date: '2024-05-01', status: 'Present', department: 'Engineering', role: 'Developer', hiddenColumn: 'Hidden1' },
        { id: 2, name: 'Jane Smith', date: '2024-05-01', status: 'Absent', department: 'HR', role: 'Manager', hiddenColumn: 'Hidden2' },
        { id: 3, name: 'Sam Johnson', date: '2024-05-01', status: 'Present', department: 'Engineering', role: 'Developer', hiddenColumn: 'Hidden3' },
        { id: 4, name: 'Chris Lee', date: '2024-05-01', status: 'Late', department: 'Sales', role: 'Sales Representative', hiddenColumn: 'Hidden4' },
        { id: 5, name: 'Anna Taylor', date: '2024-05-01', status: 'Present', department: 'Engineering', role: 'Designer', hiddenColumn: 'Hidden5' },
        { id: 6, name: 'David Brown', date: '2024-05-01', status: 'Absent', department: 'Marketing', role: 'Marketer', hiddenColumn: 'Hidden6' },
        { id: 7, name: 'Emily Davis', date: '2024-05-01', status: 'Present', department: 'Engineering', role: 'Developer', hiddenColumn: 'Hidden7' },
        { id: 8, name: 'Michael Wilson', date: '2024-05-01', status: 'Late', department: 'HR', role: 'Assistant', hiddenColumn: 'Hidden8' },
    ];

    return (
        <div>
            <AttendanceTable
                allColumns={allColumns}
                columns={initialColumns}
                data={initialData}
                actions={actions}
                onAddNew={() => console.log('Add new')}
                showFilters={true}
                showExport={true}
                showAddNew={true}
                showColumnOptions={true}
                showActions={true}
                
            />
        </div>
    );
};

export default ParentComponent;
