import React, { useState } from 'react';
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const taskMutation =  gql`
  mutation AddTask($text: String!) {
    addTask(text: $text) {
      _id
    }
  }
`

export const TaskForm = () => {
  const [addTaskMutation] = useMutation(taskMutation);
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    addTaskMutation({
      variables: {
        text,
      },
      refetchQueries: () => ['Tasks']
    })
      .then(() => console.log('Task added with success'))
      .catch(e => console.error('Error trying to add task', e));

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
