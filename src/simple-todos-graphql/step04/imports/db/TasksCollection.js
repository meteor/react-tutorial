import { Mongo } from 'meteor/mongo';

const tasksCollection = Object.assign(new Mongo.Collection('tasks'), {
  save({ text, userId }) {
    const newTaskId = this.insert({
      text,
      userId,
      createdAt: new Date(),
    });
    return this.findOne(newTaskId);
  }
});

export { tasksCollection as TasksCollection }
