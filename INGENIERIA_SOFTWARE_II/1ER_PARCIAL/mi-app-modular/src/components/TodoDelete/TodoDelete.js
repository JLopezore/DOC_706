import React from 'react';
import './TodoDelete.css';

/**
 * Componente para mostrar una tarea eliminada.
 * Props:
 * - text: string - texto de la tarea
 * - onRestore: function(index) - callback para restaurar la tarea
 * - onDelete: function(index) - callback para eliminar permanentemente
 * - index: number (opcional) - índice o id que se pasa a los callbacks
 */
function TodoDelete({ text = '', onRestore, onDelete, index = null }) {
    const handleRestore = () => {
        if (typeof onRestore === 'function') {
            onRestore(index);
        }
    };

    const handlePermanentDelete = () => {
        const confirmed = window.confirm('¿Eliminar permanentemente esta tarea? Esta acción no se puede deshacer.');
        if (!confirmed) return;
        if (typeof onDelete === 'function') {
            onDelete(index);
        }
    };

    return (
        <li className="TodoDelete-item" role="listitem" aria-label={`Tarea eliminada: ${text}`}>
            <span className="TodoDelete-text">{text}</span>
            <div className="TodoDelete-actions">
                <button
                    type="button"
                    className="TodoDelete-btn TodoDelete-restore"
                    onClick={handleRestore}
                    aria-label="Restaurar tarea"
                >
                    Restaurar
                </button>
                <button
                    type="button"
                    className="TodoDelete-btn TodoDelete-delete"
                    onClick={handlePermanentDelete}
                    aria-label="Eliminar permanentemente"
                >
                    Eliminar permanentemente
                </button>
            </div>
        </li>
    );
}

export default TodoDelete;