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
import EmployeeTable from './EmployeeTable';


const EmployeesList = () => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");
 
  let strikethroughCount = 0;
  let nonStrikethroughCount = 0;
  const updateCounters = (isStrikethrough) => {
    if (isStrikethrough) {
      strikethroughCount++;
    } else {
      nonStrikethroughCount++;
    }
  };
  
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
    (async () => {
    try {
     
      const response = await axios.put(`http://localhost:3000/api/employees/${currentEmployee.id}/todos/strikethrough`, {
        strikethroughCount: strikethroughCount, 
      });

     
      console.log('Update Strikethrough Count Response:', response.data.strikethroughCount);

   
      initFetch();
    } catch (error) {
      console.error('Error updating strikethrough count:', error);
   
    }
  })();
  
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
        setDepartment(null); 
      }
    };
  
    if (currentEmployee) {
      fetchTodos();
      fetchDepartment();
    } else {
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

            <div>
            <div className="col-md-6">
      {currentEmployee ? (
        <div>
          <h4>Employee</h4>
          <EmployeeTable data={[currentEmployee]} />
        </div>
      ) : (
        <p>No employee selected</p>
      )}
    </div>
          {/*  <Accordion>
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
      ? currentEmployee.todo_description.map((item, index) => {
          const isStrikethrough = (selectedItems[currentEmployee.id] || []).includes(index);
          updateCounters(isStrikethrough);

          return (
            <li
              key={index}
              onClick={() => handleItemClick(currentEmployee.id, index)}
              className={`list-group-item ${isStrikethrough ? "active" : ""}`}
              style={{
                cursor: "pointer",
                textDecoration: isStrikethrough ? "line-through" : "none",
              }}
            >
              {item}
            </li>
          );
        })
      : currentEmployee.todo_description
          .replace(/"/g, "")
          .split(",")
          .map((item, index) => item.trim())
          .filter((item) => item !== "")
          .map((item, index) => {
            const isStrikethrough = (selectedItems[currentEmployee.id] || []).includes(index);
            updateCounters(isStrikethrough);

            return (
              <li
                key={index}
                onClick={() => handleItemClick(currentEmployee.id, index)}
                className={`list-group-item ${isStrikethrough ? "active" : ""}`}
                style={{
                  cursor: "pointer",
                  textDecoration: isStrikethrough ? "line-through" : "none",
                }}
              >
                {item}
              </li>
            );
          })}
  </ul>

  <div>
    {/* <p>No. of tasks done: {strikethroughCount} / {strikethroughCount + nonStrikethroughCount}</p> */}
    {/* <p>Total No. of tasks: {strikethroughCount + nonStrikethroughCount}</p> 
  </div>



  </AccordionDetails>
  </Accordion>
   <Accordion>
  <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Employee Details</Typography>
         
        </AccordionSummary>
 <AccordionDetails>
           <li>Name: {currentEmployee.emp_name}</li>
          <li>Department: {department
          .filter(department=> department.id === currentEmployee.departmentId)
          .map(department => department.department)
          .join(", ")}</li> 
          <li>No. of tasks: {strikethroughCount} / {strikethroughCount + nonStrikethroughCount}</li>
          </AccordionDetails>
      </Accordion>*/}
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

