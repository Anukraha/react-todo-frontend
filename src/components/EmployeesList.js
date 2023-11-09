import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    console.log("Item clicked:", employeeId, index); // Add this line for debugging
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

