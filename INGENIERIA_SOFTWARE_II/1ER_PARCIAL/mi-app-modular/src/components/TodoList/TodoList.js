import React, { useState } from 'react';
import './TodoList.css';
import TodoItem from '../TodoItem/TodoItem'; // <-- Importar el hijo
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore"; // <-- Importa funciones de Firestore

import { useEffect } from 'react';
import TodoComplete from '../TodoComplete/TodoComplete';
import TodoDelete from '../TodoDelete/TodoDelete';

const TodoList = () => {
  // El estado 'tasks' ahora empieza vacío
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);


  // --- LEER TAREAS (GET) ---
  // useEffect se ejecutará cuando el componente se monte
  useEffect(() => {
    // 1. Creamos una referencia a nuestra colección "tasks" en Firestore
    const collectionRef = collection(db, "tasks");

    // 2. Creamos una consulta (query) para ordenar las tareas por fecha
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    // 3. onSnapshot es el ¡ESCUCHADOR EN TIEMPO REAL!
    // Se dispara una vez al inicio y luego CADA VEZ que la colección cambia.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks = [];
      querySnapshot.forEach((doc) => {
        newTasks.push({
          ...doc.data(),
          id: doc.id // El ID del documento es importante
        });
      });
      setTasks(newTasks); // Actualizamos nuestro estado de React
    });

    // Esta función de limpieza se ejecuta cuando el componente se "desmonta"
    // Evita fugas de memoria
    return () => unsubscribe();

  }, []); // El '[]' asegura que esto se ejecute solo una vez


  const handleAddTask = async (e) => { // La hacemos 'async'
  e.preventDefault();
  if (inputValue.trim() === '') return;

  // ¡En lugar de solo 'setTasks', escribimos en la BD!
  await addDoc(collection(db, "tasks"), {
    text: inputValue,
    isComplete: false,
    createdAt: serverTimestamp() // Marca de tiempo de Firebase
  });

  setInputValue('');
  // NOTA: No necesitamos 'setTasks' aquí.
  // ¡'onSnapshot' detectará el nuevo documento y actualizará el estado por nosotros!
};

  // --- NUEVAS FUNCIONES ---

  // Función para marcar una tarea como completada
  const handleMarkAsComplete = async (taskToComplete) => {
    // 1. Añadir la tarea a la colección 'completedTasks'
    await addDoc(collection(db, "completedTasks"), {
      text: taskToComplete.text,
      originalId: taskToComplete.id, // Guardamos el ID original por si acaso
      completedAt: serverTimestamp() // Marca de tiempo de cuando se completó
    });

    // 2. Eliminar la tarea de la colección original 'tasks'
    await deleteDoc(doc(db, "tasks", taskToComplete.id));
    
    // ¡onSnapshot se encargará de actualizar la UI de ambas listas!
  };

  // Función para "eliminar" una tarea (moverla a la papelera)
  const handleDeleteTask = async (taskToDelete) => {
    // 1. Añadir la tarea a la colección 'deletedTasks'
    await addDoc(collection(db, "deletedTasks"), {
      text: taskToDelete.text,
      createdAt: taskToDelete.createdAt, // Conserva la fecha de creación original
      deletedAt: serverTimestamp()      // Marca de tiempo de cuando se eliminó
    });

    // 2. Eliminar la tarea de la colección original 'tasks'
    await deleteDoc(doc(db, "tasks", taskToDelete.id));
  };

  // --- RENDER ACTUALIZADO ---

  return (
    <div className="todo-list-container">
      <h2>Mi Lista de Tareas</h2>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Añade una nueva tarea..."
        />
        <button type="submit">Añadir</button>
      </form>

      <ul>
        {/* Aquí está la magia: 
          Mapeamos las tareas y por cada una, renderizamos un <TodoItem />
          pasándole los datos y las FUNCIONES como props.
        */}
                {tasks.map(task => (
          <TodoItem 
            key={task.id}
            task={task}
            // ¡Pasa las nuevas funciones!
            onToggleComplete={() => handleMarkAsComplete(task)} // Corregido: Pasa el objeto 'task' a la función correcta
            onDeleteTask={() => handleDeleteTask(task)} // Pasa el objeto 'task' completo
          />
        ))}
      </ul>
      <h2>Historial</h2>
      <div className="history-buttons">
        <button onClick={() => { setShowCompleted(true); setShowDeleted(false); }} className={`history-btn ${showCompleted ? 'active' : ''}`}>
          Completadas
        </button>
        <button onClick={() => { setShowCompleted(false); setShowDeleted(true); }} className={`history-btn ${showDeleted ? 'active' : ''}`}>
          Eliminadas
        </button>
      </div>

      <div className="todo-history-container">
        {showCompleted && <TodoComplete />}
        {showDeleted && <TodoDelete />}
      </div>

    </div>
  );
};

export default TodoList;