import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEmployee } from "../slices/employees";

const AddEmployee = () => {
  const initialEmployeeState = {
    id: null,
    emp_name: "",
    mobile: "",
    address: ""
  };
  const [employee, setEmployee] = useState(initialEmployeeState);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setEmployee({ ...employee, [name]: value });
  };

  const saveEmployee = () => {
    const { emp_name, mobile, address } = employee;

    dispatch(createEmployee({ emp_name, mobile, address }))
      .unwrap()
      .then(data => {
        console.log(data);
        setEmployee({
          id: data.id,
          emp_name: data.emp_name,
          mobile: data.mobile,
          address: data.address
        });
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newEmployee = () => {
    setEmployee(initialEmployeeState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newEmployee}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="emp_name">Employee Name</label>
            <input
              type="text"
              className="form-control"
              id="emp_name"
              required
              value={employee.emp_name || ''}
              onChange={handleInputChange}
              name="emp_name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              required
              value={employee.mobile || ''}
              onChange={handleInputChange}
              name="mobile"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              required
              value={employee.address || ''}
              onChange={handleInputChange}
              name="address"
            />
          </div>

          <button onClick={saveEmployee} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;
