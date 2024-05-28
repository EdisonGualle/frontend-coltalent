import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'name', label: 'Nombre' },
  { id: 'institution', label: 'Institución' },
  { id: 'year', label: 'Año' },
  { id: 'type', label: 'Tipo' },
  { id: 'duration', label: 'Duración (horas)' },
];

const initialData = [
  { id: 1, name: 'Participación y aprobación del “Curso-Taller de Neuromarketing” (80 horas)', institution: 'LATINNOVA', year: 2016, type: 'Curso-Taller', duration: 80 },
  { id: 2, name: 'Participación y aprobación del “Curso de Administración Tributaria” (80 horas)', institution: 'THE SING COACH Y CAPACITACIÓN', year: 2016, type: 'Curso', duration: 80 },
  { id: 3, name: 'Por haber APROBADO el curso: NEUROCIENCIA, EMPRESA Y MARKETING con una duración de 40 horas realizado en modalidad VIRTUAL del 2021-03-01 hasta 2021-03-26.', institution: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', year: 2021, type: 'Curso', duration: 40 },
  { id: 4, name: 'Por haber APROBADO el curso: RESPONSABILIDAD INVESTIGATIVA, PROCESOS DE INVESTIGACIÓN, EDICIÓN DE LIBROS Y PERFECCIONAMIENTO EN INVESTIGACIÓN CIENTÍFCA. con una duración de 40 horas realizado en modalidad VIRTUAL del 2021-02-08 hasta 2021-03-05.', institution: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', year: 2021, type: 'Curso', duration: 40 },
];

const Training = () => {
  const [data, setData] = useState(initialData);

  const handleAddNew = () => {
    console.log('Add new record');
  };

  const handleGenerateReport = () => {
    console.log('Generate report');
  };

  const handleEdit = (id) => {
    console.log(`Edit record with id: ${id}`);
  };

  const handleDelete = (ids) => {
    console.log(`Delete records with ids: ${ids}`);
    const newData = data.filter(row => !ids.includes(row.id));
    setData(newData);
  };

  return (
    <div>
      <DynamicTable
        title="Información sobre las capacitaciones recibidas."
        columns={columns}
        data={data}
        onAddNew={handleAddNew}
        onGenerateReport={handleGenerateReport}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Training;
