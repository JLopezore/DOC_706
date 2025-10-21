import React, { useState, useEffect } from "react";
import FileManager from "./components/FileManager";
import Login from "./components/Login";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función para manejar el inicio se sesión exitoso
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Fondo decorativo con blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      {/* Renderizado condicional basado en el estado de la sesión */}
      {isLoggedIn ? (
        <FileManager onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};
