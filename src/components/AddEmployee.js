import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEmployee } from '../slices/employees';
import DepartmentDropdown from './DepartmentDropdown';
import TaskList from './TaskList';

const AddEmployee = () => {
  const initialEmployeeState = {
    id: null,
    emp_name: '',
    mobile: '',
    address: '',
    todo_description: [],
    departmentId: 1001,
    task_no: 0,
  };

  const [employee, setEmployee] = useState(initialEmployeeState);
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
  };

  const handleDepartmentChange = (event) => {
    setEmployee((prevEmployee) => ({ ...prevEmployee, departmentId: event.target.value }));
  };

  const handleTasksUpdate = (updatedTasks) => {
    const checkedTasksCount = updatedTasks.filter((task) => task.task_status).length;
 
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      task_no: checkedTasksCount,
    }));

   
    return updatedTasks;
  };

  const saveEmployee = () => {
    const { emp_name, mobile, address, todo_description, departmentId, task_no } = employee;

    const parsedTodoDescription = JSON.stringify(todo_description);

    dispatch(
      createEmployee({
        emp_name,
        mobile,
        address,
        todo_description: parsedTodoDescription,
        departmentId,
        task_no,
      })
    )
      .unwrap()
      .then((data) => {
        console.log(data);
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          id: data.id,
          emp_name: data.emp_name,
          mobile: data.mobile,
          address: data.address,
          todo_description: data.todo_description,
          departmentId: data.departmentId,
          task_no: data.task_no,
        }));
        setSubmitted(true);
      })
      .catch((e) => {
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

          <div className="form-group">
            <label htmlFor="todo_description">Task</label>
            <TaskList onTasksUpdate={handleTasksUpdate} />
          </div>

          <div className="form-group">
            <DepartmentDropdown selectedDepartment={employee.departmentId} onChange={handleDepartmentChange} />
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
