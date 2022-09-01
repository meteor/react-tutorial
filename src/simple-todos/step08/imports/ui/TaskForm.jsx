import React, { useState } from 'react';
import { TasksCollection } from '/imports/api/TasksCollection';

export const TaskForm = ({user}) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) return;

    await TasksCollection.insertAsync({
      text: text.trim(),
      createdAt: new Date(),
      userId: user._id
    });

    setText('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};
