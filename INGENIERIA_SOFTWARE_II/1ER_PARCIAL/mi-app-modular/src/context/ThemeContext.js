import React, {createContext, useState} from "react";

// 1. Crear el contexto
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {}
});

// 2. Crear el proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // 'light' o 'dark'


  // Función para alternar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // 3. Proveer el contexto a los componentes hijos
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Exportar el contexto para ser usado en otros componentes
export default ThemeContext;