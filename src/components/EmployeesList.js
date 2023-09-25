import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveEmployees,
  findEmployeesByName,
  deleteAllEmployees,
} from "../slices/employees";
import { Link } from "react-router-dom";

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
          <input
            type="text"
            className="form-control"
            placeholder="Search by emp_name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
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

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllEmployees}
        >
          Remove All
        </button>
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
