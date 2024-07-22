import React, { useEffect, useState, useContext } from 'react';
import { getConfigurations, updateConfiguration } from '../services/configurationService';
import CardConfigurable from '../components/ui/CardConfigurable';
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { AlertContext } from '../contexts/AlertContext';


const Configurations = () => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useContext(AlertContext);


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

  return (
    <div className="">
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
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
      {loading && <p>Loading...</p>}
      <div className="grid gap-10 md:grid-cols-2">
        {configurations.map(config => (
          <CardConfigurable key={config.id} config={config} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
};

export default Configurations;
