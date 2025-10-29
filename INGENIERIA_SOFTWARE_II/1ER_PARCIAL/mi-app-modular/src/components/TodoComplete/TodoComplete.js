import React, { useState, useEffect } from 'react';
import './TodoComplete.css';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const TodoComplete = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  // --- LEER TAREAS COMPLETADAS (GET) ---
  useEffect(() => {
    const collectionRef = collection(db, "completedTasks");
    const q = query(collectionRef, orderBy("completedAt", "desc")); // Ordenar por más reciente

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ 
          ...doc.data(), 
          id: doc.id 
        });
      });
      setCompletedTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  // --- ELIMINAR TAREA COMPLETADA ---
  const handleDeleteCompletedTask = async (idToDelete) => {
    const confirmed = window.confirm('¿Desea eliminar esta tarea de la lista de completadas?');
    if (!confirmed) return;

    const taskRef = doc(db, "completedTasks", idToDelete);
    await deleteDoc(taskRef);
  };

  // --- FORMATEAR FECHA ---
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    // Convierte el timestamp de Firestore a un objeto Date de JavaScript
    const date = timestamp.toDate();
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="todo-complete-container">
      <h2>Tareas Completadas</h2>
      {completedTasks.length === 0 ? (
        <p className="no-completed-tasks">Aún no hay tareas completadas.</p>
      ) : (
        <ul>
          {completedTasks.map(task => (
            <li key={task.id}>
              <span className="task-text">{task.text}</span>
              <span className="completed-date">
                Completada: {formatDate(task.completedAt)}
              </span>
              <button 
                onClick={() => handleDeleteCompletedTask(task.id)}
                className="delete-btn"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoComplete;
