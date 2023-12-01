import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [checkedTasks, setCheckedTasks] = useState(0);

  const updateCheckedTasks = (newCount) => {
    setCheckedTasks(newCount);
  };

  return (
    <TaskContext.Provider value={{ checkedTasks, updateCheckedTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  return useContext(TaskContext);
};
