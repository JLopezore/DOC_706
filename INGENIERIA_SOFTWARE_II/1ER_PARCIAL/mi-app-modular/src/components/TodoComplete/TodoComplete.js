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

  // --- MOVER TAREA A 'NO COMPLETADA' ---
  const handleUncompleteTask = async (taskToUncomplete) => {
    try {
      // 1. Añadir la tarea de nuevo a la colección 'tasks'
      // Se usa la fecha de creación original si existe, si no, la de completado.
      await addDoc(collection(db, "tasks"), {
        text: taskToUncomplete.text,
        createdAt: taskToUncomplete.createdAt || taskToUncomplete.completedAt
      });

      // 2. Eliminar la tarea de la colección 'completedTasks'
      await deleteDoc(doc(db, "completedTasks", taskToUncomplete.id));
    } catch (error) {
      console.error("Error al mover la tarea a no completadas: ", error);
      alert("Hubo un error al restaurar la tarea.");
    }
  };

  // --- ELIMINAR TAREA COMPLETADA (MOVER A PAPELERA) ---
  const handleDeleteCompletedTask = async (idToDelete) => {
    const confirmed = window.confirm('¿Mover esta tarea a la papelera?');
    if (!confirmed) return;

    // 1. Encontrar la tarea a mover en el estado local
    const taskToMove = completedTasks.find(task => task.id === idToDelete);
    if (!taskToMove) {
      console.error("No se encontró la tarea para mover.");
      return;
    }

    try {
      // 2. Añadir a la colección 'deletedTasks'
      await addDoc(collection(db, "deletedTasks"), {
        text: taskToMove.text,
        // Usar createdAt si existe, de lo contrario, usar completedAt como respaldo.
        createdAt: taskToMove.createdAt || taskToMove.completedAt, 
        deletedAt: serverTimestamp()      // Añadir fecha de eliminación
      });

      // 3. Eliminar de la colección 'completedTasks'
      await deleteDoc(doc(db, "completedTasks", idToDelete));
    } catch (error) {
      console.error("Error al mover la tarea a la papelera: ", error);
      alert("Hubo un error al mover la tarea.");
    }
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
              <input
                type="checkbox"
                checked={true}
                onChange={() => handleUncompleteTask(task)}
                className="uncomplete-checkbox"
              />
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
