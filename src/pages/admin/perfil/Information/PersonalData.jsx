import React, { useState } from "react";
import SimpleInput from "../../../../components/ui/SimpleInput";
import SimpleSelect from "../../../../components/ui/SimpleSelect";
import CustomButton from "../../../../components/ui/Button";
import { RiSaveLine, RiDeleteBin6Line } from 'react-icons/ri';
const PersonalData = () => {
  const [middleName, setMiddleName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(null);

  const genderOptions = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
    { name: "Other", value: "other" },
  ];

  const maritalStatusOptions = [
    { name: "Single", value: "single" },
    { name: "Married", value: "married" },
    { name: "Divorced", value: "divorced" },
    { name: "Widowed", value: "widowed" },
  ];

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Datos Personales</h1>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="form-group">
          <SimpleInput
            label="First Name"
            id="firstName"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleInput
            label="Middle Name"
            id="middleName"
            placeholder="Enter middle name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleInput
            label="Last Name"
            id="lastName"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleInput
            label="Email"
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleInput
            label="Phone Number"
            id="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleSelect
            label="Gender"
            options={genderOptions}
            value={gender}
            onChange={setGender}
            placeholder="Select gender"
            size="medium"
          />
        </div>
        <div className="form-group">
          <SimpleSelect
            label="Marital Status"
            options={maritalStatusOptions}
            value={maritalStatus}
            onChange={setMaritalStatus}
            placeholder="Select marital status"
            size="medium"
          />
        </div>
        <div className="sm:col-span-2 flex justify-end mt-6">
          <CustomButton
            color="blue"
            size="medium"
            icon={RiSaveLine} 
          >
            Guardar
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default PersonalData;