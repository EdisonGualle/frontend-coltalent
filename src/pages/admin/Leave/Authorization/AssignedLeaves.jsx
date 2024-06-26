import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiEdit2Line } from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import { getColumns } from './Table/getColumns';
import { useAuth } from '../../../../hooks/useAuth';
import { fetchAssignedLeaves, setAssignedLeaveFilter } from '../../../../redux/Leave/assignedLeavesSlice';

const AssignedLeaves = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { leaves, filter, loading, error } = useSelector((state) => state.assignedLeaves);

    useEffect(() => {
        dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter: 'todos' }));
    }, [dispatch, user.id]);


    const columns = getColumns(user.role, filter);


    console.log('leaves', leaves);



    
    return (
        <div>
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                            Autorizaciones de permisos
                        </Typography>
                        <Typography color="gray" className="mt-1">
                            Lista de permisos asignados para autorizar.
                        </Typography>
                    </div>
                </div>
            </CardHeader>
            {loading ? (
                <div>Cargando...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <LeaveTable 
                    columns={columns}
                  
                    data={leaves}
                    showFilters={false}
                    showExport={false}
                    showAddNew={false}
                    showColumnOptions={false}
                    showActions={false}
                    onDelete={null}
                />
            )}
        </div>
    );
};

export default AssignedLeaves;