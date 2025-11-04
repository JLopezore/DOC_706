import React, { useEffect, useState } from "react";
import './UserDirectory.css';

const UserDirectory = () => {
  // Estado para guardar la lista de usuarios
  const [users, setUsers] = useState([]);
  // Estado para saber si los datos estan cargando
  const [loading, setLoading] = useState(true);
  // Esatado para guardar cualquier error que ocurra
  const [error, setError] = useState(null);

  // Aqui es donde usaremos useEfects para cargar los datos
  useEffect(() => {
    // Usamos la API 'fetch' del navegador para hacer la petición
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("La respuesta de la red no fue satisfactoria");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data); // Guardamos los usuarios en el estado
        setError(null); // Limpiamos cualquier error previo
      })
      .catch((error) => {
        setError(error.message); // Guardamos el mensaje de error
        setUsers([]); // Limpiamos los datos de usuarios
      })
      .finally(() => {
        setLoading(false); // La carga ha terminado (sea con éxito o error)
      });
  }, []); // <-- El arreglo de dependencias vacío es MUY importante

  // Aqui mostraremos la UI basada en los estados

return (
    <div className="user-directory">
      <h2>Directorio de Usuarios</h2>

      {/* 1. Si está cargando, muestra un mensaje */}
      {loading && <p>Cargando usuarios...</p>}

      {/* 2. Si hay un error, muestra el error */}
      {error && <p className="error-message">Error: {error}</p>}

      {/* 3. Si no hay error y no está cargando, muestra la lista */}
      {!loading && !error && (
        <ul>
          {users.map(user => (
            <li key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>📧 {user.email}</p>
              <p>🌐 {user.website}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDirectory;

