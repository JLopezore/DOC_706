import React, { useState, useEffect } from 'react';
import './TodoComplete.css';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import IconTrash from '../Icons/IconTrash';

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

  // --- ELIMINAR TAREA COMPLETADA (MOVER A PAPELERA) ---
  const handleDeleteCompletedTask = async (idToDelete) => {
    // 1. Añadir la tarea a la colección 'deletedTasks'
        await addDoc(collection(db, "deletedTasks"), {
          text: idToDelete.text,
          createdAt: idToDelete.createdAt, // Conserva la fecha de creación original
          deletedAt: serverTimestamp()      // Marca de tiempo de cuando se eliminó
        });
    
        // 2. Eliminar la tarea de la colección original 'tasks'
        await deleteDoc(doc(db, "tasks", idToDelete.id));
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
                <IconTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoComplete;
