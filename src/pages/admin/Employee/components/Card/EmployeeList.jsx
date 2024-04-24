import React, { useState } from 'react';
import { getEmployees } from '../../../../../services/Employee/EmployeeService';
import EmployeeCard from './EmployeeCard';

const EmployeeList = () => {
  const employees = getEmployees();
  const [filterValue, setFilterValue] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const filterEmployees = (value) => {
    const filtered = employees.filter((employee) => {
      const { name, title } = employee;
      const fullInfo = `${name} ${title}`.toLowerCase();
      return fullInfo.includes(value.toLowerCase());
    });
    setFilteredEmployees(filtered);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    filterEmployees(value);
  };

  return (
    <div>
      <div className="mb-4 mt-1 sm:flex sm:gap-x-2">
        <label htmlFor="filter" className=" font-semibold text-gray-700">
          Buscar:
        </label>
        <input
          id="filter"
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder={`${employees.length} registros...`}
          className="text-sm px-2 py-1 border border-gray-300 mt-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 sm:mt-0"
        />
      </div>
      <div className="grid grid-cols-5 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;