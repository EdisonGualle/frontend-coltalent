import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'institution', label: 'Institución' },
  { id: 'title', label: 'Título' },
  { id: 'specialization', label: 'Especialización' },
  { id: 'level_number', label: 'Nivel de Instrucción' },
  { id: 'status', label: 'Estado' },
  { id: 'registration', label: 'Registro' },
];

const initialData = [
  { id: 1, institution: 'Instituto Tecnológico', place: 'Ciudad A', title: 'Ingeniero', specialization: 'Sistemas', level_number: "Post-Grado", status: 'Completado', date: '2020-05-20', registration: '12345' },
  { id: 2, institution: 'Universidad B', place: 'Ciudad B', title: 'Licenciado', specialization: 'Administración', level_number: 2, status: 'En Curso', date: '2022-01-15', registration: '67890' },
  { id: 3, institution: 'Colegio C', place: 'Ciudad C', title: 'Bachiller', specialization: 'Ciencias', level_number: 3, status: 'Completado', date: '2018-12-10', registration: '54321' },
];

const Education = () => {
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
        title="Información sobre la educación recibida."
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

export default Education;
