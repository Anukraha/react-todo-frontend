// DepartmentDropdown.js
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const DepartmentDropdown = ({ selectedDepartment, onChange }) => {
  const departments = [
    { id: 1001, department: 'HR' },
    { id: 1002, department: 'Testing' },
    { id: 1003, department: 'Web Development' },
    { id: 1004, department: 'Marketing' },
  ];

  return (
    <FormControl>
      <InputLabel id="department-label">Department</InputLabel>
      <Select
        labelId="department-label"
        id="department-select"
        value={selectedDepartment}
        onChange={onChange}
        label="Department"
      >
        {departments.map((department) => (
          <MenuItem key={department.id} value={department.id}>
            {department.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DepartmentDropdown;
