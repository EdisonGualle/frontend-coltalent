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
  'max_duration_days': 'dias_max',
  'max_duration_hours_min': 'horas_min',
  'max_duration_hours_max': 'horas_max',
  'advance_notice_days': 'dias_anticipacion',
  'max_days_for_leave': 'dias_solicitud_max',

  'max_weekly_hours': 'semanales_max',
  'min_weekly_hours': 'semanales_min',
  'max_daily_hours': 'diarias_max',
  'min_daily_hours': 'diarias_min',

  'min_days_for_subrogation': 'dias_subrogacion',
  'contract_renewal_days_limit': 'dias_renovacion',
  'contract_min_days_to_terminate': 'dias_terminacion',
  'weekly_hours_min': 'horas_min_semanales',
  'weekly_hours_max': 'horas_max_semanales',
  'overtime_min_hours': 'extras_min',
  'overtime_max_hours': 'extras_max',
  'holiday_min_hours': 'festivo_min',
  'holiday_max_hours': 'festivo_max',
  'rest_day_min_hours': 'descanso_min',
  'rest_day_max_hours': 'descanso_max',
  'max_consecutive_hours': 'consecutivas_max',
  'min_consecutive_hours': 'consecutivas_min',
  'min_break_duration': 'descanso_min',
  'max_break_duration': 'descanso_max',
  'min_daily_work': 'trabajo_diario_min',
  'max_daily_work': 'trabajo_diario_max',
  'min_daily_break': 'descanso_diario_min',
  'max_daily_break': 'descanso_diario_max',


  // Puedes agregar más claves aquí si es necesario
};


const categoryOrder = [
  'Sistema',
  'Contratos',
  'Trabajo',
  'Horarios',
  'Permisos',
  'Subrogaciones',
  'Trabajo Extra',
];


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
        {categoryOrder.map((category) => (
          groupedConfigurations[category] && (
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
          ))
        )}
      </div>
    </div>
  );
};

export default Configurations;
