import React from "react";
import './Header.css';  
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";


const Header = () => {
  return (
    <header className="app-header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="100" />
      <h1>Mi Aplicación Modular</h1>
      <ThemeSwitcher />  {/* Componente para cambiar el tema */}
    </header>
  );
};

export default Header;

