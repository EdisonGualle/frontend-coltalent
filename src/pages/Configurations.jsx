import React, { useEffect, useState, useContext } from 'react';
import { getConfigurations, updateConfiguration } from '../services/configurationService';
import CardConfigurable from '../components/ui/CardConfigurable';
import { CardHeader, Typography } from "@material-tailwind/react";
import { AlertContext } from '../contexts/AlertContext';
import LoadingIndicator from '../components/ui/LoadingIndicator'
// Mapeo de claves en inglés a su equivalente en español en formato snake_case
const keyTranslations = {
  'max_intentos': 'máximo_intentos',
  'tiempo_bloqueo': 'tiempo_bloqueo',
  'max_duration_days': 'duracion_maxima_dias',
  'max_duration_hours_min': 'duracion_minima_horas',
  'max_duration_hours_max': 'duracion_maxima_horas',
  'advance_notice_days': 'dias_anticipacion',
  'max_weekly_hours': 'horas_semanales_maximas',
  'min_weekly_hours': 'horas_semanales_minimas',
  'max_daily_hours': 'horas_diarias_maximas',
  'min_daily_hours': 'horas_diarias_minimas',
  'min_days_for_subrogation': 'dias_subrogacion',
  // Puedes agregar más claves aquí si es necesario
};

// Función para traducir las claves
const translateKey = (key) => {
  return keyTranslations[key] || key; // Si no existe traducción, retorna el key original
};

// Función para agrupar las configuraciones por categoría
const groupByCategory = (configurations) => {
  return configurations.reduce((acc, config) => {
    const category = config.category || 'Sin categoría'; // Asigna "Sin categoría" si no tiene categoría
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(config);
    return acc;
  }, {});
};

const Configurations = () => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useContext(AlertContext);
  const [isEditing, setIsEditing] = useState(null); // Estado para manejar la edición

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await getConfigurations();
        setConfigurations(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, []);

  const handleSave = async (id, newValue) => {
    try {
      await updateConfiguration({ id, data: { value: newValue } });
      setConfigurations(configurations.map(config => (config.id === id ? { ...config, value: newValue } : config)));
      showAlert('Configuración actualizada correctamente', 'success');
    } catch (error) {
      setError(error.message);
      showAlert('Error al actualizar la configuración', 'error');
    }
  };

  // Agrupamos las configuraciones por categoría
  const groupedConfigurations = groupByCategory(configurations);

  return (
    <div className="">
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Configuraciones del sistema
            </Typography>
            <Typography color="gray" className="mt-1">
              Aquí puedes configurar los valores que afectan el comportamiento del sistema.
            </Typography>
          </div>
        </div>
      </CardHeader>
      {loading && <LoadingIndicator />}
      <div className="divide-y divide-gray-200 grid grid-cols-3 gap-4">
        {/* Iteramos sobre cada categoría y mostramos una card por cada una */}
        {Object.keys(groupedConfigurations).map((category) => (
          <div key={category} className="bg-white shadow-sm rounded-lg p-6 ">
            <h2 className="text-xl font-semibold">{category}</h2>
            <ul>
              {groupedConfigurations[category].map(config => (
                <CardConfigurable
                  key={config.id}
                  config={config} // Pasamos la config con su key original para las validaciones
                  translatedKey={translateKey(config.key)} // Pasamos la clave traducida para mostrar
                  onSave={handleSave}
                  showAlert={showAlert}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  relatedConfigValue={configurations.find(c =>
                    (config.key === 'max_duration_hours_min' && c.key === 'max_duration_hours_max') ||
                    (config.key === 'max_duration_hours_max' && c.key === 'max_duration_hours_min')
                  )?.value}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Configurations;
