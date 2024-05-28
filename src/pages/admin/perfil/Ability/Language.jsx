import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'language', label: 'Idioma' },
  { id: 'written_level', label: 'Nivel Escrito' },
  { id: 'oral_level', label: 'Nivel Oral' },
  { id: 'proficiency_certificate', label: 'Certificado de Competencia' },
  { id: 'institution_issuer', label: 'Institución Emisora' },
];

const initialData = [
  { id: 1, language: 'Inglés', written_level: 'Avanzado', oral_level: 'Avanzado', proficiency_certificate: 'IELTS', institution_issuer: 'British Council' },
  { id: 2, language: 'Español', written_level: 'Nativo', oral_level: 'Nativo', proficiency_certificate: '', institution_issuer: '' },
];

const Language = () => {
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
        title="Información sobre los idiomas que hablas"
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

export default Language;
