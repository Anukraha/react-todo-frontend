import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ onTasksUpdate }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const apiResponse = await axios.get('http://localhost:3000/api/employees/tasks');
        const apiTasks = apiResponse.data;
        setTasks(apiTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, task_status: !task.task_status } : task
      )
    );
  };

  useEffect(() => {
    // Notify the parent component about the updated tasks whenever the tasks state changes
    if (onTasksUpdate) {
      onTasksUpdate(tasks);
    }
  }, [tasks, onTasksUpdate]);

  return (
    <div>
      <form>
        {tasks.map((task) => (
          <div key={task.task_id}>
            <input
              type="checkbox"
              name="tasks"
              value={task.task_id}
              id={`task-${task.task_id}`}
              onChange={() => handleCheckboxChange(task.task_id)}
              checked={task.task_status}
            />
            <label htmlFor={`task-${task.task_id}`}>{task.task_description}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default TaskList;
