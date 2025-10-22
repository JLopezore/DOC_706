import React from "react";  
import './Err404.css';

const Err404 = () => {
    return (
        //<img src={"../Images/img404.svg"} alt="Placeholder" width="500" height="300"/>
        <div className="err404-container">
            <img src={"../Images/img404.svg"} alt="Placeholder"/>
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