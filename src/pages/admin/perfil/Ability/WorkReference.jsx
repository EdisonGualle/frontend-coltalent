import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'name', label: 'Nombre' },
  { id: 'position', label: 'Posición' },
  { id: 'company_name', label: 'Nombre de la Empresa' },
  { id: 'contact_number', label: 'Número de Contacto' },
  { id: 'relationship_type', label: 'Tipo de Relación' },
];

const initialData = [
  { id: 1, name: 'Juan Pérez', position: 'Gerente de Proyectos', company_name: 'TechCorp', contact_number: '555-1234', relationship_type: 'Jefe' },
  { id: 2, name: 'María López', position: 'Analista de Sistemas', company_name: 'DataCorp', contact_number: '555-5678', relationship_type: 'Compañero de trabajo' },
  { id: 3, name: 'Carlos Martínez', position: 'Director de TI', company_name: 'NetCorp', contact_number: '555-8765', relationship_type: 'Jefe' },
  { id: 4, name: 'Ana Gómez', position: 'Consultora de Negocios', company_name: 'BizCorp', contact_number: '555-4321', relationship_type: 'Cliente' },
  { id: 5, name: 'Luis Rodríguez', position: 'Ingeniero de Software', company_name: 'CodeCorp', contact_number: '555-3456', relationship_type: 'Compañero de trabajo' },
];

const WorkReference = () => {
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
        title="Información sobre las referencias laborales."
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

export default WorkReference;
