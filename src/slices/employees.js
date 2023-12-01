import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EmployeeDataService from "../services/EmployeeService";

const initialState = [];

export const createEmployee = createAsyncThunk(
  "employees/create",
  async ({ emp_name, mobile, address, todo_description, departmentId, task_no }) => {
    const res = await EmployeeDataService.create({ emp_name, mobile, address, todo_description, departmentId, task_no });
    return res.data;
  }
);

export const retrieveEmployees = createAsyncThunk(
  "employees/retrieve",
  async () => {
    const res = await EmployeeDataService.getAll();
    return res.data;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, data }) => {
    const res = await EmployeeDataService.update(id, data);
    return res.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async ({ id }) => {
    await EmployeeDataService.remove(id);
    return { id };
  }
);

export const deleteAllEmployees = createAsyncThunk(
  "employees/deleteAll",
  async () => {
    const res = await EmployeeDataService.removeAll();
    return res.data;
  }
);

export const findEmployeesByName = createAsyncThunk(
  "employees/findByName",
  async ({ emp_name }) => {
    const res = await EmployeeDataService.findByName(emp_name);
    return res.data;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers: {
    [createEmployee.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [retrieveEmployees.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [updateEmployee.fulfilled]: (state, action) => {
      const index = state.findIndex(employee => employee.id === action.payload.id);
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
    [deleteEmployee.fulfilled]: (state, action) => {
      let index = state.findIndex(({ id }) => id === action.payload.id);
      state.splice(index, 1);
    },
    [deleteAllEmployees.fulfilled]: (state, action) => {
      return [];
    },
    [findEmployeesByName.fulfilled]: (state, action) => {
      return [...action.payload];
    },
  },
});

const { reducer } = employeeSlice;
export default reducer;