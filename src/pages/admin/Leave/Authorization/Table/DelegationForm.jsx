import React, { useEffect } from 'react';
import MultiSelect from '../../../../../components/ui/MultiSelect';
import Textarea from '../../../../../components/ui/Textarea';
import CustomSelect from '../../../../../components/ui/Select';

const DelegationForm = ({
    responsibilities,
    selectedResponsibilities,
    setSelectedResponsibilities,
    reason,
    setReason,
    candidates,
    selectedDelegate,
    setSelectedDelegate,
    responsibilitiesError,
    delegateError,
    delegationReasonError,
}) => {

    // Mapeo directo dentro del componente
    const mappedCandidates = candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.full_name,
    }));

    console.log(selectedResponsibilities);

    return (
        <div>
            <div>
                <label className="block font-semibold text-gray-900 mb-2">Detalles de la Delegación</label>
            </div>
            <CustomSelect
                options={mappedCandidates}
                value={selectedDelegate}
                onChange={setSelectedDelegate}
                placeholder="Seleccione un delegado"
                isSearchable={true}
                error={delegateError ? 'Debe seleccionar un delegado.' : ''}
            />

            {/* Seleccionar Responsabilidades */}
            <div className="mt-2">
                <MultiSelect
                    options={responsibilities.map((responsibility) => ({
                        id: responsibility.id,
                        name: responsibility.name,
                    }))}
                    selectedValues={selectedResponsibilities}
                    onChange={setSelectedResponsibilities}
                    placeholder="Seleccione responsabilidades..."
                    emptyMessage="No hay responsabilidades disponibles para delegar."
                    label="Responsabilidades"
                />
                {responsibilitiesError && (
                    <p className="text-xs text-red-500 mt-1">Debe seleccionar al menos una responsabilidad.</p>
                )}
            </div>

           
            <div className='mb-4 mt-2'>
                <Textarea
                    value={reason}
                    onChange={setReason}
                    placeholder="Escriba el motivo de la delegación..."
                    rows={2}
                    error={delegationReasonError ? 'El motivo es obligatorio.' : ''}
                />
            </div>

        </div>
    );
};

export default DelegationForm;
