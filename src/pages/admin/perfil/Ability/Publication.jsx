import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'publication_type', label: 'Tipo de Publicación' },
  { id: 'title', label: 'Título' },
  { id: 'publisher', label: 'Editorial' },
  { id: 'isbn_issn', label: 'ISBN/ISSN' },
  { id: 'authorship', label: 'Autoría' },
];

const initialData = [
  {
    id: 1,
    publication_type: 'Regional',
    title: 'ANÁLISIS DE LA COOPERACIÓN EN LA CADENA DE SUMINISTRO LÁCTEA EN RIOBAMBA, PROVINCIA DE CHIMBORAZO ECUADOR',
    publisher: 'LATINDEX OBSERVATORIO DE LA ECONOMÍA LATINOAMERICANA',
    isbn_issn: 'ISSN:1696-8352',
    authorship: 'Sí'
  },
  {
    id: 2,
    publication_type: 'Regional',
    title: 'ANÁLISIS DE LOS CRÉDITOS DE CONSUMO OTORGADOS EN LA CIUDAD DE RIOBAMBA, PROVINCIA DE CHIMBORAZO -ECUADOR',
    publisher: 'LATINDEX OBSERVATORIO DE LA ECONOMÍA LATINOAMERICANA',
    isbn_issn: 'ISSN:1696-8352',
    authorship: 'Sí'
  }
];

const Publication = () => {
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
        title="Información sobre las publicaciones realizadas."
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

export default Publication;
