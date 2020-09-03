---
title: "8: Security"
---

Now we have moved all of our app's sensitive code into methods, we need to learn about the other half of Meteor's security story. Until now, we have worked assuming the entire database is present on the client, meaning if we call `Tasks.find()` we will get every task in the collection. That's not good if users of our application want to store privacy-sensitive data. We need a way of controlling which data Meteor sends to the client-side database.

## 8.1: More Security

Just like with `insecure` in the last step, all new Meteor apps start with the `autopublish` package, which automatically synchronizes all the database contents to the client. Let's remove it and see what happens:

```
meteor remove autopublish
```

When the app refreshes, the task list will be empty. Without the `autopublish` package, we will have to specify explicitly what the server sends to the client. The functions in Meteor that do this are `Meteor.publish` and `Meteor.subscribe`.

## 8.2: Tasks Publication

For now let's add a publication for all tasks.

`imports/api/tasks.js`
```javascript
      }
    });
  }
});
 
if (Meteor.isServer) {
  Meteor.publish('tasks', function() { return Tasks.find() })
}
```

## 8.3: Tasks Subscription

Then we can quickly subscribe to tha publication.

`imports/ui/App.jsx`
```javascript
    _.set(filter, 'checked', false);
  }
 
  const { tasks, incompleteTasksCount, user } = useTracker(() => {
    Meteor.subscribe('tasks');
 
    return ({
      tasks: Tasks.find(filter, {sort: {createdAt: -1}}).fetch(),
      incompleteTasksCount: Tasks.find({checked: {$ne: true}}).count(),
      user: Meteor.user(),
    });
  });
 
  if (!user) {
    return (
```

Once you have done this, all the tasks will reappear.

Calling `Meteor.publish` on the server registers a publication named "tasks". When `Meteor.subscribe` is called on the client with the publication name, the client subscribes to all the data from that publication, which in this case is all the tasks in the database. To truly see the power of the `publish/subscribe` model, let's implement a feature that allows users to mark tasks as "private" so that no other users can see them.

## 8.4: Private Task Method

Let's add a new property to tasks called `isPrivate` and write a method for setting it.

`imports/api/tasks.js`
```javascript
        isChecked
      }
    });
  },
 
  'tasks.setPrivate'(taskId, isPrivate) {
    check(taskId, String);
    check(isPrivate, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    Tasks.update(taskId, {
      $set: {
        isPrivate
      }
    })
  }
});
```

## 8.5: Toggle Private

Now we just setup some wiring up to our `Task Component` and add a toggleable button.

`imports/ui/Task.jsx`
```javascript
import React from 'react';
import classnames from 'classnames';
 
export const Task = ({ task, onCheckboxClick, onDeleteClick, onTogglePrivateClick }) => {
  const classes = classnames('task', {
    'checked': Boolean(task.isChecked)
  });
...some lines skipped...
  return (
    <li className={classes}>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <button onClick={ () => onTogglePrivateClick(task) }>{ task.isPrivate ? 'Private' : 'Public' }</button>
      <span>{ task.text } { task.username && <i>({ task.username })</i> }</span>
      <input
        type="checkbox"
```

## 8.6: Add Private Class

We need a CSS class for future design work as well.

`imports/ui/App.jsx`
```javascript
  Meteor.call('tasks.setChecked', _id, !isChecked);
};
 
const togglePrivate = ({ _id, isPrivate }) => {
  Meteor.call('tasks.setPrivate', _id, !isPrivate);
};
 
const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
 
export const App = () => {
...some lines skipped...
          task={ task }
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask}
          onTogglePrivateClick={togglePrivate}
        />) }
      </ul>
```

## 8.7: Publish Visible Tasks

We should only publish tasks visible to the user, that is, if they are not private or if they are owned by the current user.

`imports/api/tasks.js`
```javascript
});
 
if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  })
}
```

## 8.8: Check User Permission

Only the owner of a task should be able to change certain things.

`imports/api/tasks.js`
```javascript
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    const task = Tasks.findOne(taskId);
 
    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
...some lines skipped...
    check(taskId, String);
    check(isChecked, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    if (task.isPrivate && task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
...some lines skipped...
    check(taskId, String);
    check(isPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    if (!this.userId || task.owner !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
```

## 8.9: Remove Unneeded Code

At this point of development we do not need this boilerplate anymore.

`server/main.js`
```javascript
import { Meteor } from 'meteor/meteor';
import '/imports/api/tasks';
 
Meteor.startup(() => {
  if (!Accounts.findUserByUsername('meteorite')) {
...some lines skipped...
      password: 'password'
    });
  }
});
```
