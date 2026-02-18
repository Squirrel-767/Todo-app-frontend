import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

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
    <div>
      <h1>My Todos</h1>
      <button onClick={handleLogout}>Logout</button>
      <input placeholder="New todo..." value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
          <button onClick={() => toggleTodo(todo)}>
            {todo.isCompleted ? 'Undo' : 'Done'}
          </button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}