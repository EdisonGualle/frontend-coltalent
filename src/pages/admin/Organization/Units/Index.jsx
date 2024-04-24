import React, { useState, useEffect } from 'react';
import { UnitColumns } from './Table/UnitColumns';
import { RiAddLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import UnitTable from './Table/UnitTable';
import { getUnits } from '../../../../services/Company/UnitService';

const UnitIndex = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await getUnits();
        setUnits(data.data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchUnits();
  }, []);

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de unidades
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todas las unidades
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-full py-2 px-5" size="sm">
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva unidad</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <UnitTable columns={UnitColumns} data={units} />
    </>
  );
};

export default UnitIndex;