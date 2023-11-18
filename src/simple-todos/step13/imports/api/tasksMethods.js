import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.methods({
  async 'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    await TasksCollection.insertAsync({
      text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  async 'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    await TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});
