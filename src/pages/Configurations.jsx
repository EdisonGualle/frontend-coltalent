import React from 'react';
import CardConfigurable from '../components/ui/ConfigCard';

const Configurations = () => {
  return (
    <div className="p-6">
      <CardConfigurable 
        title="Configuración 1" 
        inputPlaceholder="Valor de configuración 1" 
        textareaPlaceholder="Definición de configuración 1" 
      />
      <CardConfigurable 
        title="Configuración 2" 
        inputPlaceholder="Valor de configuración 2" 
        textareaPlaceholder="Definición de configuración 2" 
      />
      {/* Agrega más configuraciones aquí si es necesario */}
    </div>
  );
};

export default Configurations;
