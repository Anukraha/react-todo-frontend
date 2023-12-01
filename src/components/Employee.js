import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { updateEmployee, deleteEmployee } from "../slices/employees";
import EmployeeDataService from "../services/EmployeeService";
import DepartmentDropdown from "./DepartmentDropdown";

const Employee = (props) => {
  const { id }= useParams();
  let navigate = useNavigate();

  const initialEmployeeState = {
    id: null,
    emp_name: "",
    mobile: "",
    address: "",
    todo_description:[],
    departmentId: 1001, 
  };
  const [currentEmployee, setCurrentEmployee] = useState(initialEmployeeState);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const getEmployee = id => {
    EmployeeDataService.get(id)
      .then(response => {
        setCurrentEmployee(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id)
      getEmployee(id);
  }, [id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };


  const updateContent = () => {
    dispatch(updateEmployee({ id: currentEmployee.id, data: currentEmployee }))
      .unwrap()
      .then(response => {
        console.log(response);
        setMessage("The employee was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeEmployee = () => {
    dispatch(deleteEmployee({ id: currentEmployee.id }))
      .unwrap()
      .then(() => {
        navigate("/employees");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentEmployee ? (
        <div className="edit-form">
          <h4>Employee</h4>
          <form>
            <div className="form-group">
              <label htmlFor="emp_name">Employee Name</label>
              <input
                type="text"
                className="form-control"
                id="emp_name"
                name="emp_name"
                value={currentEmployee.emp_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile</label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                value={currentEmployee.mobile}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={currentEmployee.address}
                onChange={handleInputChange}
              />
            </div>
          
          <div className="form-group">
  <DepartmentDropdown   
              selectedDepartment={currentEmployee.departmentId}
              onChange={handleInputChange}/>
  </div>
            
          </form>

          

          <button className="badge badge-danger mr-2" onClick={removeEmployee}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateContent}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please create an Employee...</p>
        </div>
      )}
    </div>
  );
};

export default Employee;
