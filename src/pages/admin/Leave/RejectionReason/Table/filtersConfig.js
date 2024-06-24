// src/config/filtersConfig.js
export const filtersConfig = [
    {
      column: 'status',
      label: 'Status',
      options: [
        { value: 'Present', label: 'Present' },
        { value: 'Absent', label: 'Absent' },
        { value: 'Late', label: 'Late' }
      ]
    },
    {
      column: 'department',
      label: 'Department',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'HR', label: 'HR' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' }
      ]
    }
  ];
  