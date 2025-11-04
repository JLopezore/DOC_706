import React from "react";

const Welcome = ({nombre}) => {
    let etq;
    let imagen;
    if (nombre === "Desarrollador") {
        etq = nombre + " eres un crack!";
        imagen = "https://unirfp.unir.net/wp-content/uploads/sites/23/2023/07/ventajas-aprender-programar.jpg";
    } else {
        etq = nombre;
        imagen  = "https://i.pinimg.com/736x/b1/6c/f3/b16cf30a73e39f9b8819bd9b61ff6b09.jpg";
    }
     return (
        <div>
            <h2>Bienvenido a la aplicación, {etq}</h2>
            <p>Esta es un ejemplo de un componente modularizado.</p>
            <img src={imagen} alt="Placeholder" width="500" height="300"/>
        </div>
    );
};
        

export default Welcome;