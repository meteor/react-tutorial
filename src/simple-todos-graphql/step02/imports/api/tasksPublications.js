import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find(
    { userId: this.userId },
    { fields: { _id: 1, isChecked: 1, userId: 1 } }
  );
});
