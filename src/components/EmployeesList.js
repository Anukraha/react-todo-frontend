/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import {
  retrieveEmployees,
  findEmployeesByName,
  deleteAllEmployees,
} from "../slices/employees";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const EmployeesList = () => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");
 


  const employees = useSelector(state => state.employees);
  const dispatch = useDispatch();

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const initFetch = useCallback(() => {
    dispatch(retrieveEmployees());
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const refreshData = () => {
    setCurrentEmployee(null);
    setCurrentIndex(-1);
  };

  const setActiveEmployee = (employee, index) => {
    setCurrentEmployee(employee);
    setCurrentIndex(index);
  };

  const removeAllEmployees = () => {
    dispatch(deleteAllEmployees())
      .then(response => {
        refreshData();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    refreshData();
    dispatch(findEmployeesByName({ emp_name: searchName }));
  };

  
  const [selectedItems, setSelectedItems] = useState({});

  const handleItemClick = (employeeId, index) => {
    console.log("Item clicked:", employeeId, index); 
    setSelectedItems(prevState => { const updatedItems = Array.isArray(prevState[employeeId])
        ? [...prevState[employeeId]]
        : [];
      if (updatedItems.includes(index)) {
        updatedItems.splice(updatedItems.indexOf(index), 1);
      } else {
        updatedItems.push(index);
      }
      return {
        ...prevState,
        [employeeId]: updatedItems,
      };
    });
  };
  
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    // Function to fetch todos data for the current employee
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/employees/${currentEmployee.id}/todos`);
        setTodos(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError(error.message || 'Error fetching todos');
        setLoading(false);
        setTodos([]); // Clear todos in case of an error
      }
    };

    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/employees/${currentEmployee.id}/dept`);
        setDepartment(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching department:', error);
        setError(error.message || 'Error fetching department');
        setLoading(false);
        setDepartment(null); // Clear department in case of an error
      }
    };
  
    // Fetch todos for the current employee when currentEmployee changes
    if (currentEmployee) {
      fetchTodos();
      fetchDepartment();
    } else {
      // Clear todos if no current employee is selected
      setTodos([]);
      setDepartment(null);
    }
  }, [currentEmployee]);

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <TextField
            label="Search by emp_name"
            variant="outlined"
            value={searchName}
            onChange={onChangeSearchName}
            fullWidth
          />
          <div className="input-group-append">
            <Button
              variant="outlined"
              color="primary"
              onClick={findByName}
              style={{ marginLeft: "10px" }}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      

      <div className="col-md-6">

        <h4>Employees List</h4>

        <ul className="list-group">
          {employees &&
            employees.map((employee, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveEmployee(employee, index)}
                key={index}
              >
                {employee.emp_name}
              </li>
            ))}
        </ul>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginTop: "20px" }}
          onClick={removeAllEmployees}
        >
          Remove All
        </Button>
      </div>
      
      <div className="col-md-6">
        {currentEmployee ? (
          <div>
            <h4>Employee</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{" "}
              {currentEmployee.emp_name}
            </div>
            <div>
              <label>
                <strong>Mobile:</strong>
              </label>{" "}
              {currentEmployee.mobile}
            </div>
            <div>
              <label>
                <strong>Address</strong>
              </label>{" "}
              {currentEmployee.address}
            </div>
            <div>
              <label>
                <strong>Department</strong>
              </label>{" "}
              <p>
        {department
          .filter(department=> department.id === currentEmployee.departmentId)
          .map(department => department.department)
          .join(", ")}
      </p>
          
            </div>
            <div>
            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>To-do</Typography>
          
        </AccordionSummary>
        <AccordionDetails>
        <ul className="list-group">
        {Array.isArray(currentEmployee.todo_description)
  ? currentEmployee.todo_description.map((item, index) => (
      <li
        key={index}
        onClick={() => handleItemClick(currentEmployee.id, index)}
        className={`list-group-item ${
          (selectedItems[currentEmployee.id] || []).includes(index)
            ? "active"
            : ""
        }`}
        style={{
          cursor: "pointer",
          textDecoration: (selectedItems[currentEmployee.id] || []).includes(index)
            ? "line-through"
            : "none",
        }}
      >
        {item}
      </li>
    ))
  : currentEmployee.todo_description
        .replace(/"/g, "") // Remove double quotes
        .split(",")
        .map((item, index) => item.trim())
        .filter((item) => item !== "") // Remove empty strings
        .map((item, index) => (
          <li
  key={index}
  onClick={() => handleItemClick(currentEmployee.id, index)}
  className={`list-group-item ${
    (selectedItems[currentEmployee.id] || []).includes(index)
      ? "active"
      : ""
  }`}
  style={{
    cursor: "pointer",
    textDecoration: (selectedItems[currentEmployee.id] || []).includes(index)
      ? "line-through"
      : "none",
  }}
>
  {item}
 
</li>

        ))}
        
</ul>
<div>
{loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    {!loading && !error && todos.length > 0 && currentEmployee && (
      <p>
        {todos
          .filter(todo => todo.employeeId === currentEmployee.id)
          .map(todo => todo.description)
          .join(", ")}
      </p>
    )}
    {!loading && !error && todos.length === 0 && <p>No todos available.</p>}
  </div>
  </AccordionDetails>
      </Accordion>
            </div>

            <Link
              to={"/employees/" + currentEmployee.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Employee...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;

