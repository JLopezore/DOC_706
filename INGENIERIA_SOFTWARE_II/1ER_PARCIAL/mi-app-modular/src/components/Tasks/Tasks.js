import React from 'react';
import TodoList from '../TodoList/TodoList';
import TodoComplete from '../TodoComplete/TodoComplete';
import './Tasks.css';

const Tasks = () => {
  return (
    <div className="tasks-view-container">
      <div className="tasks-column">
        <TodoList />
      </div>
      <div className="tasks-column">
        <TodoComplete />
      </div>
    </div>
  );
};

export default Tasks;
