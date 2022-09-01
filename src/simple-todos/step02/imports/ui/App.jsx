import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';

export const App = () => {
  const tasks = useTracker(async () => await TasksCollection.find({}).fetchAsync());

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <ul>
        {tasks.map(task => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
};
