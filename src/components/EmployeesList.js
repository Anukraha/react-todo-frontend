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
import DepartmentDropdown from "./DepartmentDropdown";

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
      <div><DepartmentDropdown/></div>

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
