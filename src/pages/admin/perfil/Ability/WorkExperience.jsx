import React, { useState } from 'react';
import DynamicTable from '../components/Table/DynamicTable';	

const columns = [
  { id: 'from', label: 'Desde' },
  { id: 'to', label: 'Hasta' },
  { id: 'position', label: 'Posición' },
  { id: 'institution', label: 'Institución' },
  { id: 'responsibilities', label: 'Responsabilidades' },
  { id: 'activities', label: 'Actividades' },
  { id: 'functions', label: 'Funciones' },
  { id: 'departure_reason', label: 'Razón de Salida' },
  { id: 'note', label: 'Nota' },
];

const initialData = [
  { 
    id: 1, 
    from: '2020-01-01', 
    to: '2021-12-31', 
    position: 'Desarrollador de Software', 
    institution: 'TechCorp', 
    responsibilities: 'Desarrollo y mantenimiento de aplicaciones web.', 
    activities: 'Implementación de nuevas funcionalidades, corrección de errores.', 
    functions: 'Codificación, pruebas, despliegue.', 
    departure_reason: 'Oportunidad de crecimiento profesional.', 
    note: 'Experiencia muy enriquecedora.' 
  },
  { 
    id: 2, 
    from: '2018-03-01', 
    to: '2019-12-31', 
    position: 'Analista de Datos', 
    institution: 'DataCorp', 
    responsibilities: 'Análisis de datos para mejorar la toma de decisiones.', 
    activities: 'Recolección y limpieza de datos, generación de informes.', 
    functions: 'Análisis, visualización de datos.', 
    departure_reason: 'Proyecto completado.', 
    note: 'Trabajo desafiante y gratificante.' 
  },
  { 
    id: 3, 
    from: '2015-06-01', 
    to: '2018-02-28', 
    position: 'Administrador de Redes', 
    institution: 'NetCorp', 
    responsibilities: 'Administración de la infraestructura de redes de la empresa.', 
    activities: 'Configuración y mantenimiento de hardware y software de redes.', 
    functions: 'Gestión de servidores, seguridad de red.', 
    departure_reason: 'Reducción de personal.', 
    note: 'Aprendí mucho sobre seguridad y administración de redes.' 
  },
];

const WorkExperience = () => {
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
        title="Información sobre la experiencia laboral."
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

export default WorkExperience;
