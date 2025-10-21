import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import TodoList from './components/TodoList/TodoList';
import UserDirectory from './components/UserDirectory/UserDirectory';
import ThemeContext from './context/ThemeContext';
import { useContext } from 'react';


function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App ${theme}`}>
      <Header />
      <main>
        <UserDirectory />
        <TodoList />
        <Welcome nombre="Desarrollador" />
        <Welcome nombre="Jorge" />
      </main>
    </div>
  );
}

export default App;
