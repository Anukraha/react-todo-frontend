import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Todo = () => {
  const { id } = useParams(); // Extract employeeId from the URL params
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch todos data
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employees/${id}/todos`);
        setTodos(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Error fetching todos');
        setLoading(false);
      }
    };

    // Call the fetchTodos function
    fetchTodos();
  }, [id]); // Re-run the effect whenever the id param changes

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {todos.length === 0 && !loading && !error && <p>No todos available.</p>}
      {todos.length > 0 && (
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>{todo.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Todo;
