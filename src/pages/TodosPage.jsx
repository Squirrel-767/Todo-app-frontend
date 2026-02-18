import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './TodosPage.css';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [activeUser, setActiveUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setActiveUser(payload.email || payload.username || payload.sub || '');
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }, []);

  // Load todos on page open
  useEffect(() => {
    api.get('/todos').then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    const res = await api.post('/todos', { title });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = async (todo) => {
    const res = await api.patch(`/todos/${todo.id}`, { isCompleted: !todo.isCompleted });
    setTodos(todos.map(t => t.id === todo.id ? res.data : t));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="todos-page">
      <div className="todos-container">
        <div className="todos-header">
          <h1 className="todos-title">My Todos</h1>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <p className="welcome-text">Welcome, {activeUser}</p>
        <div className="add-todo-row">
          <input
            className="todo-input"
            placeholder="New todo..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button className="add-button" onClick={addTodo}>Add</button>
        </div>
        <div className="todo-list">
          {todos.map(todo => (
            <div className="todo-item" key={todo.id}>
              <span className={`todo-title${todo.isCompleted ? ' completed' : ''}`}>
                {todo.title}
              </span>
              <button className="toggle-button" onClick={() => toggleTodo(todo)}>
                {todo.isCompleted ? 'Undo' : 'Done'}
              </button>
              <button className="delete-button" onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}