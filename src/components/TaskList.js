import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
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

  const handleCheckboxChange = async (taskId) => {
    try {
      // Send a request to update task_status to true
      await axios.put(`http://localhost:3000/api/employees/tasks/${taskId}`, {
        task_status: true,
      });

      // Update the local state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === taskId ? { ...task, task_status: true } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

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
              checked={task.task_status} // Use task_status to control checked state
            />
            <label htmlFor={`task-${task.task_id}`}>{task.task_description}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default TaskList;
