import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, selectEmployees, } from '../../../../../redux/Employee/employeSlice';
import EmployeeCard from './EmployeeCard';


const EmployeeList = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
      dispatch(fetchEmployees());
  }, [dispatch]);

  const fetchEmployeesAndUpdateList = useCallback(() => {
    dispatch(fetchEmployees())
      .then((response) => {
        setFilteredEmployees(response.payload);
      })
      .catch((error) => {
        console.error('Error al obtener los empleados:', error);
      });
  }, [dispatch]);


useEffect(() => {
  if (employees && employees.length > 0) {
    setFilteredEmployees(
      employees.filter((employee) => {
        const { full_name, position, identification } = employee;
        const fullInfo = `${full_name} ${identification} ${position ? position.name : ''}`.toLowerCase();
        return fullInfo.includes(filterValue.toLowerCase());
      })
    );
  } else {
    setFilteredEmployees([]); // Restablece filteredEmployees a un arreglo vacío si employees está indefinido o vacío
  }
}, [employees, filterValue]);


  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const getPagedEmployees = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (employees === undefined || employees.length === 0) {
    return (
      <>
        <div className="mb-4 mt-1 sm:flex sm:gap-x-2 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-1 sm:mt-0"></div>
        </div>
        <div className="grid grid-cols-5 gap-6 animate-pulse">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-blue-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-pulse">
                  <div className="flex flex-col items-center gap-2 p-4 relative">
                    <div className="relative w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 absolute top-2 right-2"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }


  return (
    <div>
      <div className="mb-4 mt-1 sm:flex sm:gap-x-2">
        <label htmlFor="filter" className="font-semibold text-gray-700">
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

      <div className='h-[60vh] overflow-auto custom-scrollbar'>
      {employees && employees.length > 0 ? (
        filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {getPagedEmployees().map((employee) => (
              <EmployeeCard key={employee.id} employee={employee}  updateEmployees={fetchEmployeesAndUpdateList} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-base text-red-500">No hay empleados que coincidan con su búsqueda.</p>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-base text-gray-500">No hay empleados registrados.</p>
        </div>
      )}
      <div className="flex justify-center mt-5 pb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={`page-${index + 1}`}
            className={`px-2 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      </div>

    </div>
  );
};

export default EmployeeList;
