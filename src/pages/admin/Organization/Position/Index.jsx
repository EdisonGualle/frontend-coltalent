import React, { useState, useEffect } from 'react';
import { RiAddLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";

import { getPositions } from '../../../../services/Company/PositionService';
import { positionColumns } from './Table/PositionColumns';
import PositionTable from './Table/PositionTable';

const PositionIndex = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getPositions();
        setPositions(data.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de Cargos
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todos los cargos
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-full py-2 px-5" size="sm">
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva cargo</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <PositionTable columns={positionColumns} data={positions} />
    </>
  );
};

export default PositionIndex;