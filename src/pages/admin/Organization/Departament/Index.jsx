import React, { useState, useEffect } from 'react';
import { DepartamentColumns } from './Table/DepartamentColumns';
import { RiAddLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import DepartamentTable from './Table/DepartamentTable';
import { getDepartments } from '../../../../services/Company/DepartamentService';

const DepartamentIndex = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data.data);
      } catch (error) {
        console.error('Error fetching department:', error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de departamentos
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todos los departamentos
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-full py-2 px-5" size="sm">
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nuevo Departamento</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <DepartamentTable columns={DepartamentColumns} data={departments} />
    </>
  );
};

export default DepartamentIndex;