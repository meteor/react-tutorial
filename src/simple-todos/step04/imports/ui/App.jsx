import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';

const toggleChecked =
  async ({ _id, isChecked }) => {
    await TasksCollection.updateAsync(_id, {
      $set: {
        isChecked: !isChecked,
      },
    });
  };

const deleteTask =
  async ({ _id }) => await TasksCollection.removeAsync(_id);

export const App = () => {
  const tasks = useTracker(async () =>
    await TasksCollection.find({}, { sort: { createdAt: -1 } }).fetchAsync()
  );

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <TaskForm />

      <ul>
        {tasks.map(task => (
          <Task
            key={task._id}
            task={task}
            onCheckboxClick={toggleChecked}
            onDeleteClick={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};
