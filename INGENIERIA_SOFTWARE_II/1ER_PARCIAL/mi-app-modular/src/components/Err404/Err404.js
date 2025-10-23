import React from "react";  
import './Err404.css';
import img404 from './img404.svg';

const Err404 = () => {
    const imagenPath = "./img404.svg"; // Ruta de la imagen local
    return (
        
        <div className="err404-container">
            <img src={imagenPath} alt="Página no encontrada" />
            <h1>Ups... La página no se ha encontrado</h1>
            <p>Intentea con los siguientes enlaces:</p>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/tareas">Lista de Tareas</a></li>
                <li><a href="/directorio">Directorio de Usuarios</a></li>
            </ul>
        </div>
    );
}

export default Err404;