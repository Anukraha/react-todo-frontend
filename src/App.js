import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Todo from "./components/Todo";
import AddEmployee from "./components/AddEmployee";
import Employee from "./components/Employee";
import EmployeesList from "./components/EmployeesList";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/employees" className="navbar-brand">
          Employee Manager
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/employees"} className="nav-link">
            Employees
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<EmployeesList/>} />
          <Route path="/employees" element={<EmployeesList/>} />
          <Route path="/add" element={<AddEmployee/>} />
          <Route path="/employees/:id" element={<Employee/>} />
          <Route path="/employees/:id/todos" component={<Todo/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
