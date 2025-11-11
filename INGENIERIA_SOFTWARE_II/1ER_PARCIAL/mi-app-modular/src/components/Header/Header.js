import React from "react";
import './Header.css';  
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="app-header">
    
      <div className="logo-container">
        <img src={"https://logoeps.com/wp-content/uploads/2013/05/snoopy-character-vector.png"} alt="Logo" className="logo-image" />
        <h1 className="logo">Mi snoopy App</h1>

      </div>
      <div className="divider">
        <nav>
            {/* Usamos <Link> en lugar de <a href=""> */}
            <Link to="/">Inicio</Link>
            <Link to="/tareas">Tareas</Link>
            <Link to="/directorio">Directorio</Link>
        </nav>
      </div>


      <div className="theme-switcher-container">
        <ThemeSwitcher />  {/* Componente para cambiar el tema */}
      </div>
    </header>
  );
};

export default Header;

