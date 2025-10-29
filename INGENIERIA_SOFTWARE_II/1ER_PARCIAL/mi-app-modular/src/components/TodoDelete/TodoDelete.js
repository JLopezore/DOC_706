import React, { useState, useEffect } from 'react';
import './TodoDelete.css';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import IconTrash from '../Icons/IconTrash';
import IconRestore from '../Icons/IconRestore';

const TodoDelete = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);

  // --- LEER TAREAS ELIMINADAS (GET) ---
  useEffect(() => {
    const collectionRef = collection(db, "deletedTasks");
    const q = query(collectionRef, orderBy("deletedAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ 
          ...doc.data(), 
          id: doc.id 
        });
      });
      setDeletedTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  // --- RESTAURAR TAREA ---
  const handleRestoreTask = async (taskToRestore) => {
    // Añadir de nuevo a la colección principal de tareas
    await addDoc(collection(db, "tasks"), {
      text: taskToRestore.text,
      isComplete: false, // Las tareas restauradas no están completas
      createdAt: taskToRestore.createdAt  // Conserva fecha original o crea una nueva
    });
    // Eliminar de la colección de tareas eliminadas
    await deleteDoc(doc(db, "deletedTasks", taskToRestore.id));
  };

  // --- ELIMINAR TAREA PERMANENTEMENTE ---
  const handlePermanentDelete = async (idToDelete) => {
    const confirmed = window.confirm('¿Eliminar permanentemente esta tarea? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    
    const taskRef = doc(db, "deletedTasks", idToDelete);
    await deleteDoc(taskRef);
  };

  // --- FORMATEAR FECHA ---
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
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
    <div className="todo-delete-container">
      <h2>Tareas Eliminadas</h2>
      {deletedTasks.length === 0 ? (
        <p className="no-deleted-tasks">No hay tareas eliminadas.</p>
      ) : (
        <ul>
          {deletedTasks.map(task => (
            <li key={task.id} className="TodoDelete-item">
              <span className="TodoDelete-text">{task.text}</span>
              <span className="deleted-date">
                Eliminada: {formatDate(task.deletedAt)}
              </span>
              <div className="TodoDelete-actions">
                <button
                  onClick={() => handleRestoreTask(task)}
                  className="TodoDelete-btn TodoDelete-restore"
                >
                  <IconRestore />
                </button>
                <button
                  onClick={() => handlePermanentDelete(task.id)}
                  className="TodoDelete-btn TodoDelete-delete"
                >
                  <IconTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoDelete;