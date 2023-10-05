import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import http from "../http-common";

const DepartmentDropdown = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await http.get('/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
  
    fetchDepartments();
  }, []);

  const handleChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <div>
     <Select
  value={selectedDepartment}
  onChange={handleChange}
  label="Department"
>
  {departments.map((department) => (
    <MenuItem key={department.id} value={department.dept_name}>
      {department.dept_name}
    </MenuItem>
  ))}
</Select>
{selectedDepartment && <p>Selected Department: {selectedDepartment}</p>}
    </div>
  );
};

export default DepartmentDropdown;
