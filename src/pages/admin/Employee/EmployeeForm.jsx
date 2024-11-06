import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import { isValidCI } from '../../../Utils/validationCedula.js';
import { isValidName, isValidDateOfBirth, isValidEthnicity, isValidNationality, isValidGender, isValidCanton, isValidProvince, isValidParish, isValidNumber, isValidDirection, isValidPosition, isValidUnit } from '../../../Utils/validationEmployee.js';
import { validateEmail, validateLandlinePhone, validateMobilePhone } from '../../../Utils/validationsV2.js';
import { RiUserLine, RiMailLine, RiPhoneLine, RiHomeLine, RiBriefcaseLine, RiCalendarLine, RiSmartphoneLine } from 'react-icons/ri';
import { getCantons, getParishes, getProvinces } from '../../../services/Employee/Address/addressService.js';
import { getDirections, getUnitsAndPositions, getPositions } from '../../../services/Employee/Organization/organizationService.js';
import { getEmployee } from '../../../services/Employee/EmployeService1.js';
import {
  BsPersonVcard, BsGlobeAmericas, BsPassport, BsGeoAlt,
  BsSignpost, BsHouseDoor, BsSignpostSplit, BsCompass
} from "react-icons/bs";

import { fetchRoles } from '../../../redux/User/rolSlice.js';
import CustomSelect from '../../../components/ui/Select.jsx';
import WorkScheduleForm from './WorkScheduleForm.jsx';


const steps = [
  { number: 1, title: "Información Personal", icon: "👤" },
  { number: 2, title: "Información de Contacto", icon: "📞" },
  { number: 3, title: "Información de Residencia", icon: "🏠" },
  { number: 4, title: "Información Laboral", icon: "💼" },
  { number: 5, title: "Horario de Trabajo", icon: "🕒" }
];
const maritalStatusOptions = {
  hombre: ['Soltero', 'Casado', 'Viudo', 'Divorciado', 'Separado', 'Otro'],
  mujer: ['Soltera', 'Casada', 'Viuda', 'Divorciada', 'Separada', 'Otra'],
  otro: ['Otro']
};

const EmployeeForm = ({ onSubmit, onCancel, formErrors, initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    gender: '',
    maritalStatus: '',
    identification: '',
    firstName: '',
    lastName: '',
    date_of_birth: '',
    ethnicity: '',
    nationality: '',
    personal_email: '',
    personal_phone: '',
    home_phone: '',
    work_phone: '',
    address: '',
    direction: '',
    unit: '',
    position: '',
    province: '',
    canton: '',
    parish: '',
    sector: '',
    main_street: '',
    secondary_street: '',
    number: '',
    reference: ''
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [maritalOptions, setMaritalOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState(null);
  const [currentMaritalStatusOptions, setCurrentMaritalStatusOptions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cantons, setCantons] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');

  const [directions, setDirections] = useState([]);
  const [units, setUnits] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const [selectedRole, setSelectedRole] = useState(null);

  const [scheduleErrors, setScheduleErrors] = useState({});

  const [workSchedule, setWorkSchedule] = useState({
    monday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    tuesday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    wednesday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    thursday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    friday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    saturday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    sunday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
  });



  // Cargar roles al montar el componente, solo si no están ya en el estado global
  const rolesState = useSelector((state) => state.role);
  const roles = rolesState ? rolesState.roles : [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles());
    }
  }, [dispatch, roles.length]);

  const handleRoleChange = (option) => {
    setSelectedRole(option);
    setErrors((prevErrors) => ({
      ...prevErrors,
      user: { role_id: option ? '' : 'Por favor, selecciona un rol.' }
    }));
  };


  // Agregar este efecto para cargar los datos del empleado si initialData.id está presente
  useEffect(() => {
    const fetchEmployee = async (id) => {
      try {
        const response = await getEmployee(id);
        const employeeData = response.data;

        // Preselect provinces, cantons, and parishes based on employee address
        if (employeeData.address) {
          const selectedProvinceId = employeeData.address.parish.canton.province.id;
          const selectedCantonId = employeeData.address.parish.canton.id;
          const selectedParishId = employeeData.address.parish.id;

          // Load cantons and parishes based on the selected province and canton
          const cantons = await getCantons(selectedProvinceId);
          const parishes = await getParishes(selectedCantonId);

          setSelectedProvince(selectedProvinceId);
          setCantons(cantons);
          setSelectedCanton(selectedCantonId);
          setParishes(parishes);

          setFormData(prevFormData => ({
            ...prevFormData,
            province: selectedProvinceId,
            canton: selectedCantonId,
            parish: selectedParishId,
          }));
        }

        setFormData(prevFormData => ({
          ...prevFormData,
          id: employeeData.id,
          gender: employeeData.gender || '',
          maritalStatus: employeeData.marital_status || '',
          identification: employeeData.identification || '',
          firstName: `${employeeData.first_name} ${employeeData.second_name || ''}`.trim(),
          lastName: `${employeeData.last_name} ${employeeData.second_last_name || ''}`.trim(),
          date_of_birth: employeeData.date_of_birth || '',
          ethnicity: employeeData.ethnicity || '',
          nationality: employeeData.nationality || '',
          personal_email: employeeData.contact?.personal_email || '',
          personal_phone: employeeData.contact?.personal_phone || '',
          home_phone: employeeData.contact?.home_phone || '',
          work_phone: employeeData.contact?.work_phone || '',
          address: employeeData.address || '',
          direction: employeeData.position?.direction?.id || '',
          unit: employeeData.position?.unit?.id || '',
          position: employeeData.position?.id || '',
          sector: employeeData.address?.sector || '',
          main_street: employeeData.address?.main_street || '',
          secondary_street: employeeData.address?.secondary_street || '',
          number: employeeData.address?.number || '',
          reference: employeeData.address?.reference || ''
        }));

        if (employeeData.position) {
          if (employeeData.position.unit_id) {
            setSelectedDirection(employeeData.position.unit.direction.id);
            setSelectedUnit(employeeData.position.unit.id);
          } else if (employeeData.position.direction_id) {
            setSelectedDirection(employeeData.position.direction.id);
          }
          setPositions([employeeData.position]);
        }


        // Preselect role
        if (employeeData.role) {
          setSelectedRole({
            label: employeeData.role.name,
            value: employeeData.role
          });
        }


      } catch (error) {
        console.error('Error loading employee data', error);
      }
    };

    if (initialData && initialData.id) {
      fetchEmployee(initialData.id);
    }
  }, [initialData]);


  useEffect(() => {
    setErrors({}); // Reinicia los errores al montar el componente
  }, []);

  // Fusión de errores del backend con errores del frontend
  useEffect(() => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...formErrors,
    }));
  }, [formErrors]);


  useEffect(() => {
    if (formData.gender) {
      setMaritalOptions(maritalStatusOptions[formData.gender.toLowerCase()]);
    } else {
      setMaritalOptions([]);
    }
  }, [formData.gender]);



  const handleNext = () => {
    const newErrors = {};

    // Validaciones solo para el primer paso
    if (currentStep === 1) {
      newErrors['employee.identification'] = isValidCI(formData.identification);
      newErrors['employee.firstName'] = isValidName(formData.firstName, 'nombre');
      newErrors['employee.lastName'] = isValidName(formData.lastName, 'apellido');
      newErrors['employee.date_of_birth'] = isValidDateOfBirth(formData.date_of_birth);
      newErrors['employee.gender'] = isValidGender(formData.gender);
      newErrors['employee.ethnicity'] = isValidEthnicity(formData.ethnicity);
      newErrors['employee.nationality'] = isValidNationality(formData.nationality);
    }

    // Validaciones para el segundo paso
    if (currentStep === 2) {
      newErrors['employee.contact.personal_email'] = validateEmail(formData.personal_email);
      newErrors['employee.contact.personal_phone'] = validateMobilePhone(formData.personal_phone);
      newErrors['employee.contact.home_phone'] = validateLandlinePhone(formData.home_phone);
      newErrors['employee.contact.work_phone'] = validateLandlinePhone(formData.work_phone);
    }

    // Validaciones para el tercer paso
    if (currentStep === 3) {
      newErrors['employee.address.province'] = isValidProvince(formData.province);
      newErrors['employee.address.canton'] = isValidCanton(formData.canton);
      newErrors['employee.address.parish'] = isValidParish(formData.parish);
      newErrors['employee.address.number'] = isValidNumber(formData.number);
    }

    // Validaciones para el cuarto paso
    if (currentStep === 4) {
      newErrors['employee.direction'] = isValidDirection(formData.direction);
      newErrors['employee.unit'] = isValidUnit(formData.unit);
      newErrors['employee.position'] = isValidPosition(formData.position);
    }

    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));

    if (Object.values(newErrors).every((error) => !error)) {
      setCurrentStep(currentStep + 1);
    }
  };



  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const validationMethods = {
      'identification': isValidCI,
      'firstName': (val) => isValidName(val, 'nombre'),
      'lastName': (val) => isValidName(val, 'apellido'),
      'date_of_birth': isValidDateOfBirth,
      'ethnicity': isValidEthnicity,
      'nationality': isValidNationality,
      'gender': isValidGender,
      'personal_email': validateEmail,
      'personal_phone': validateMobilePhone,
      'home_phone': validateLandlinePhone,
      'work_phone': validateLandlinePhone,
      'number': isValidNumber
    };

    if (validationMethods[name]) {
      const errorMessage = validationMethods[name](value);
      if (name === 'personal_email') {
        setErrors(prevErrors => ({ ...prevErrors, 'employee.contact.personal_email': errorMessage }));
      } else if (name === 'personal_phone') {
        setErrors(prevErrors => ({ ...prevErrors, 'employee.contact.personal_phone': errorMessage }));
      } else if (name === 'home_phone') {
        setErrors(prevErrors => ({ ...prevErrors, 'employee.contact.home_phone': errorMessage }));
      } else if (name === 'work_phone') {
        setErrors(prevErrors => ({ ...prevErrors, 'employee.contact.work_phone': errorMessage }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [`employee.${name}`]: errorMessage }));
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (currentStep === steps.length) {

      newErrors['employee.position'] = isValidPosition(formData.position);
      newErrors['employee.position_id'] = isValidPosition(formData.position);

      if (!selectedRole) {
        newErrors['user.role_id'] = 'Por favor, selecciona un rol.';
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));

      if (Object.values(newErrors).every((error) => !error)) {
        const [first_name, ...second_name] = formData.firstName.split(' ');
        const [last_name, ...second_last] = formData.lastName.split(' ');

        const submissionData = {
          id: formData.id,
          employee: {
            identification: formData.identification,
            first_name: first_name,
            second_name: second_name.join(' '),
            last_name: last_name,
            second_last_name: second_last.join(' '),
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            ethnicity: formData.ethnicity,
            position_id: formData.position,
            contact: {
              personal_email: formData.personal_email,
              personal_phone: formData.personal_phone,
              home_phone: formData.home_phone,
              work_phone: formData.work_phone,
            },
            address: {
              sector: formData.sector,
              main_street: formData.main_street,
              secondary_street: formData.secondary_street,
              number: formData.number,
              reference: formData.reference,
              parish_id: formData.parish,
            },
          },
          user: {
            role_id: selectedRole?.value?.id // Verifica que selectedRole y selectedRole.value estén definidos
          }
        };


        if (Object.values(scheduleErrors).every((error) => !error)) {
          // Proceso de envío de datos
        } else {
          console.log('Errores en el horario:', scheduleErrors);
        }

        onSubmit(submissionData);
      }
    } else {
      handleNext();
    }
  };


  useEffect(() => {
    if (selectedGender && selectedGender.value) {
      const newOptions = maritalStatusOptions[selectedGender.value] || [];
      setCurrentMaritalStatusOptions(newOptions);
    } else {
      setCurrentMaritalStatusOptions([]);
    }
  }, [selectedGender]);


  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);


  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setFormData({ ...formData, province: provinceId, canton: '', parish: '' });

    if (provinceId) {
      setErrors({ ...errors, 'employee.address.province': '' });
    }

    try {
      const data = await getCantons(provinceId);
      setCantons(data);
      setParishes([]);
    } catch (error) {
      console.error("Error fetching cantons:", error);
    }
  };

  const handleCantonChange = async (e) => {
    const cantonId = e.target.value;
    setSelectedCanton(cantonId);
    setFormData({ ...formData, canton: cantonId, parish: '' });

    if (cantonId) {
      setErrors({ ...errors, 'employee.address.canton': '' });
    }

    try {
      const data = await getParishes(cantonId);
      setParishes(data);
    } catch (error) {
      console.error("Error fetching parishes:", error);
    }
  };

  const handleParishChange = (e) => {
    const parishId = e.target.value;
    setFormData({ ...formData, parish: parishId });

    if (parishId) {
      setErrors({ ...errors, 'employee.address.parish': '' });
    }
  };

  const handleDirectionChange = async (e) => {
    const directionId = e.target.value;
    setSelectedDirection(directionId);
    setFormData({ ...formData, direction: directionId, unit: '', position: '' });

    if (directionId) {
      setErrors({ ...errors, 'employee.direction': '' });
    }

    try {
      const data = await getUnitsAndPositions(directionId);
      setUnits(data.units);
      setPositions(data.positions);
    } catch (error) {
      console.error("Error fetching units and positions:", error);
    }
  };

  const handleUnitChange = async (e) => {
    const unitId = e.target.value;
    setSelectedUnit(unitId);
    setFormData({ ...formData, unit: unitId, position: '' });

    if (unitId) {
      setErrors({ ...errors, 'employee.unit': '' });
    }

    try {
      const data = await getPositions(unitId);
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };


  // Asegúrate de que el método handlePositionChange gestione correctamente la posición
  const handlePositionChange = (e) => {
    const positionId = e.target.value;
    setFormData({ ...formData, position: positionId });

    const errorMessage = isValidPosition(positionId);
    setErrors(prevErrors => ({
      ...prevErrors,
      'employee.position': errorMessage,
      'employee.position_id': errorMessage
    }));
  };


  // Fetch directions on component mount
  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const data = await getDirections();
        setDirections(data);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, []);

  // Fetch units and positions when a direction is selected
  useEffect(() => {
    const fetchUnitsAndPositions = async () => {
      if (selectedDirection) {
        try {
          const data = await getUnitsAndPositions(selectedDirection);
          setUnits(data.units);
          setPositions(data.positions);
        } catch (error) {
          console.error("Error fetching units and positions:", error);
        }
      } else {
        setUnits([]);
        setPositions([]);
      }
    };

    fetchUnitsAndPositions();
  }, [selectedDirection]);

  // Fetch positions when a unit is selected
  useEffect(() => {
    const fetchPositions = async () => {
      if (selectedUnit) {
        try {
          const data = await getPositions(selectedUnit);
          setPositions(data);
        } catch (error) {
          console.error("Error fetching positions:", error);
        }
      } else if (selectedDirection) {
        const data = await getUnitsAndPositions(selectedDirection);
        setPositions(data.positions);
      }
    };

    fetchPositions();
  }, [selectedUnit]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: currentStep >= step.number ? 1 : 0.8, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer
                  ${currentStep >= step.number
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-50 text-gray-400'
                  } shadow-sm border-2 ${currentStep >= step.number ? 'border-blue-200' : 'border-gray-300'}`}
                onClick={() => handleStepClick(step.number)}
              >
                {step.icon}
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-4 text-sm font-medium text-center text-gray-600 cursor-pointer"
                onClick={() => handleStepClick(step.number)}
              >
                {step.title}
              </motion.div>
              {step.number < steps.length && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-8 left-full w-full  bg-blue-200 transform origin-left"
                />
              )}
            </div>
          ))}
        </div>
        <motion.div
          key={currentStep}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold mb-8 text-gray-700"
        >
          Paso {currentStep}: {steps[currentStep - 1].title}
        </motion.div>

        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Campos para Información Personal */}
            <Input
              label="Cédula"
              id="identification"
              name="identification"
              placeholder="Ingrese la cédula"
              value={formData.identification || ''}
              onChange={handleInputChange}
              error={errors['employee.identification']}
              icon={BsPersonVcard}
            />
            <Input
              label="Nombres"
              id="firstName"
              name="firstName"
              placeholder="Ingrese los nombres"
              value={formData.firstName || ''}
              onChange={handleInputChange}
              error={errors['employee.firstName']}
              icon={RiUserLine}
            />
            <Input
              label="Apellidos"
              id="lastName"
              name="lastName"
              placeholder="Ingrese los apellidos"
              value={formData.lastName || ''}
              onChange={handleInputChange}
              error={errors['employee.lastName']}
              icon={RiUserLine}
            />
            <Input
              label="Fecha de Nacimiento"
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              placeholder="Ingrese la fecha de nacimiento"
              value={formData.date_of_birth || ''}
              onChange={handleInputChange}
              error={errors['employee.date_of_birth']}
              icon={RiCalendarLine}
            />
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.gender ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione el género</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
              </select>
              {errors['employee.gender'] && <p className="mt-1 text-xs text-red-500">{errors['employee.gender']}</p>}
            </div>
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">Estado Civil</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                disabled={!formData.gender}
                className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione el estado civil</option>
                {maritalOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <Input
              label="Etnia"
              id="ethnicity"
              name="ethnicity"
              placeholder="Ingrese la etnia"
              value={formData.ethnicity || ''}
              onChange={handleInputChange}
              error={errors['employee.ethnicity']}
              icon={BsGlobeAmericas}
            />
            <Input
              label="Nacionalidad"
              id="nationality"
              name="nationality"
              placeholder="Ingrese la nacionalidad"
              value={formData.nationality || ''}
              onChange={handleInputChange}
              error={errors['employee.nationality']}
              icon={BsPassport}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Correo Personal"
              id="personal_email"
              name="personal_email"
              placeholder="Ingrese el correo personal"
              value={formData.personal_email || ''}
              onChange={handleInputChange}
              error={errors['employee.contact.personal_email']}
              icon={RiMailLine}
            />
            <Input
              label="Celular Personal"
              id="personal_phone"
              name="personal_phone"
              placeholder="Ingrese el celular personal"
              value={formData.personal_phone || ''}
              onChange={handleInputChange}
              error={errors['employee.contact.personal_phone']}
              icon={RiSmartphoneLine}
            />
            <Input
              label="Teléfono de Casa"
              id="home_phone"
              name="home_phone"
              placeholder="Ingrese el teléfono de casa"
              value={formData.home_phone || ''}
              onChange={handleInputChange}
              error={errors['employee.contact.home_phone']}
              icon={RiPhoneLine}
            />
            <Input
              label="Teléfono de Trabajo"
              id="work_phone"
              name="work_phone"
              placeholder="Ingrese el teléfono de trabajo"
              value={formData.work_phone || ''}
              onChange={handleInputChange}
              error={errors['employee.contact.work_phone']}
              icon={RiBriefcaseLine}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provincia</label>
              <select
                id="province"
                name="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.province ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione la provincia</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
              {errors['employee.address.province'] && <p className="mt-1 text-xs text-red-500">{errors['employee.address.province']}</p>}
            </div>
            <div>
              <label htmlFor="canton" className="block text-sm font-medium text-gray-700">Cantón</label>
              <select
                id="canton"
                name="canton"
                value={selectedCanton}
                onChange={handleCantonChange}
                disabled={!selectedProvince}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.canton ? 'border-red-500' : 'border-gray-300'}focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione el cantón</option>
                {cantons.map((canton) => (
                  <option key={canton.id} value={canton.id}>{canton.name}</option>
                ))}
              </select>
              {errors['employee.address.canton'] && <p className="mt-1 text-xs text-red-500">{errors['employee.address.canton']}</p>}
            </div>
            <div>
              <label htmlFor="parish" className="block text-sm font-medium text-gray-700">Parroquia</label>
              <select
                id="parish"
                name="parish"
                value={formData.parish}
                onChange={handleParishChange}
                disabled={!selectedCanton}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.parish ? 'border-red-500' : 'border-gray-300'}focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione la parroquia</option>
                {parishes.map((parish) => (
                  <option key={parish.id} value={parish.id}>{parish.nombre}</option>
                ))}
              </select>
              {errors['employee.address.parish'] && <p className="mt-1 text-xs text-red-500">{errors['employee.address.parish']}</p>}
            </div>
            <Input
              label="Sector"
              id="sector"
              name="sector"
              placeholder="Ingrese el sector"
              value={formData.sector || ''}
              onChange={handleInputChange}
              error={errors['employee.address.sector']}
              icon={BsGeoAlt}
            />
            <Input
              label="Calle Principal"
              id="main_street"
              name="main_street"
              placeholder="Ingrese la calle principal"
              value={formData.main_street || ''}
              onChange={handleInputChange}
              error={errors['employee.address.main_street']}
              icon={BsSignpost}
            />
            <Input
              label="Calle Secundaria"
              id="secondary_street"
              name="secondary_street"
              placeholder="Ingrese la calle secundaria"
              value={formData.secondary_street || ''}
              onChange={handleInputChange}
              error={errors['employee.address.secondary_street']}
              icon={BsSignpostSplit}
            />
            <Input
              label="Número de casa"
              id="number"
              name="number"
              type='number'
              placeholder="Ingrese el número"
              value={formData.number || ''}
              onChange={handleInputChange}
              error={errors['employee.address.number']}
              icon={BsHouseDoor}
            />
            <Input
              label="Referencia"
              id="reference"
              name="reference"
              placeholder="Ingrese una referencia"
              value={formData.reference || ''}
              onChange={handleInputChange}
              error={errors['employee.address.reference']}
              icon={BsCompass}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="direction" className="block text-sm font-medium text-gray-700">Dirección</label>
              <select
                id="direction"
                name="direction"
                value={selectedDirection}
                onChange={handleDirectionChange}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.direction ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione la dirección</option>
                {directions.map((direction) => (
                  <option key={direction.id} value={direction.id}>{direction.name}</option>
                ))}
              </select>
              {errors['employee.direction'] && <p className="mt-1 text-xs text-red-500">{errors['employee.direction']}</p>}
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidad</label>
              <select
                id="unit"
                name="unit"
                value={selectedUnit}
                onChange={handleUnitChange}
                disabled={!selectedDirection}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.unit ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione la unidad</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
              {errors['employee.unit'] && <p className="mt-1 text-xs text-red-500">{errors['employee.unit']}</p>}
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">Cargo</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handlePositionChange}
                disabled={!selectedDirection && !selectedUnit}
                className={`mt-2 block w-full pl-3 pr-10 py-3 text-base border-2 ${errors.position ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-300 focus:border-blue-300 sm:text-sm rounded-md`}
              >
                <option value="">Seleccione el cargo</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>{position.name}</option>
                ))}
              </select>
              {(errors['employee.position'] || errors['employee.position_id']) && (
                <p className="mt-1 text-xs text-red-500">
                  {errors['employee.position'] || errors['employee.position_id']}
                </p>
              )}
            </div>

            <div>
              <CustomSelect
                label="Rol"
                options={roles}
                value={selectedRole}
                onChange={handleRoleChange}
                placeholder="Selecciona un rol"
                error={errors.user?.role_id}
                isSearchable={true}
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <WorkScheduleForm
            workSchedule={workSchedule}
            setWorkSchedule={setWorkSchedule}
            setScheduleErrors={setScheduleErrors} // Pasar la función de manejo de errores
          />
        )}

        <div className="flex justify-between mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            type="button"
            className="px-6 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Anterior
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
          >
            {currentStep < steps.length ? 'Siguiente' : isEditMode ? 'Editar Empleado' : 'Crear Empleado'}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;