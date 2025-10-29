import React from 'react';
import TodoList from '../TodoList/TodoList';
import TodoComplete from '../TodoComplete/TodoComplete';
import './Tasks.css';
import TodoDelete from '../TodoDelete/TodoDelete';

const Tasks = () => {
  return (
    <div className="tasks-view-container">
        <div>
            <TodoDelete />
        </div>
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
