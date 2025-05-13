import React, { useState, useEffect } from 'react';
import { Sun, Moon, Trash2, Edit, Check, X, Plus } from 'lucide-react';

export default function TodoApp() {
  // State for todos
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    // Check for user's preferred theme
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Apply theme to document
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    applyTheme(newMode);
  };

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle completion status
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editText.trim() !== '') {
      setTodos(
        todos.map(todo =>
          todo.id === editingId ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true; // 'all' filter
  });

  return (
    <div className="min-h-screen flex flex-col items-center transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md p-6 mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo App</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        {/* Add Todo Form */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md flex items-center"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex mb-4 space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${filter === 'pending' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${filter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
          >
            Completed
          </button>
        </div>
        
        {/* Todo List */}
        <ul className="space-y-2">
          {filteredTodos.length === 0 ? (
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-center text-gray-500 dark:text-gray-400">
              No tasks found
            </li>
          ) : (
            filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-between group transition-colors"
              >
                {editingId === todo.id ? (
                  <div className="flex items-center flex-grow mr-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="p-1 border rounded w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex ml-2">
                      <button onClick={saveEdit} className="text-green-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="text-red-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className="h-4 w-4 mr-2 accent-blue-500 cursor-pointer"
                      />
                      <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(todo)}
                        className="text-blue-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        aria-label="Edit task"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        
        {/* Task count */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {todos.filter(todo => !todo.completed).length} task(s) remaining
        </div>
      </div>
    </div>
  );
}