---
title: "8: Methods"
---

Before this step, any user of the app could edit any part of the database making changes directly in the client. This might be fine for quick prototyping, but real applications need to control access to their data.

In Meteor, the easiest way to make changes in the server safely is by declaring _methods_, instead of calling `insert`, `update`, or `remove` directly in the client.

With methods, you can verify if the user is authenticated and authorized to perform certain actions and then change the database accordingly.

Meteor Method is a way to communicate with your server using the function `Meteor.call`, you need to provide the name of your method and the arguments.
 
> You can read more about Methods [here](https://guide.meteor.com/methods.html).

## 8.1: Disable Quick Prototyping

Every newly created Meteor project has the `insecure` package installed by default.

This package allows us to edit the database from the client as we said above, which is useful for quick prototyping.

We need to remove it, because as the name suggests it is `insecure`.

```
meteor remove insecure
```

Now your app changes don't work anymore as you have revoked all client-side database permissions. Try to insert a new task for example, you are going to see `insert failed: Access denied` in your browser console.

## 8.2: Add Task Methods

Now you need to define methods.

You need one method for each database operation we want to perform on the client.

Methods should be defined in code executed both in the client, and the server for Optimistic UI support.

### Optimistic UI

When we call a method on the client using `Meteor.call`, two things happen in parallel:

1. The client sends a request to the server to run the method in a secure environment.
2. A simulation of the method runs directly on the client trying to predict the outcome of the call.

This means that a newly created task actually appears on the screen before the result comes back from the server.

If the result matches that of the server everything remains as is, otherwise the UI gets patched to reflect the actual state of the server.

> Meteor does all this work for you, you don't need to worry about it but it's important to understand what is happening. You can read more about Optimistic UI [here](https://blog.meteor.com/optimistic-ui-with-meteor-67b5a78c3fcf).

Now you should add a new file called `tasksMethods` in your `imports/api` folder. In this file for each operation that you are doing in the client and next we are going to call these Methods from the client instead of using Mini Mongo operations directly.

Inside Methods you have a few special properties ready to be used on `this` object, for example you have the `userId` of the authenticated user.

`imports/api/tasksMethods.js`
```js
import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';
 
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.insert({
      text,
      createdAt: new Date,
      userId: this.userId,
    })
  },
 
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.remove(taskId);
  },
 
  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});
```

As you can see in the code we are also using the `check` package to make sure we are receiving the expected types of input, this is important to make sure you know exactly what you are inserting or updating in your database.

The last part is to make sure your server is registering these methods, you can do this by importing this file, to force the evaluation, in the `server/main.js`.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
```

See that you don't need to get any symbol back from the import, you only need to ask for your server to import the file then `Meteor.methods` will be evaluated and will register your methods on server startup.

## 8.3: Implement Method Calls

As you have defined your methods, you need to update the places we were operating the collection to use them instead.

In the `TaskForm` file you should call `Meteor.call('tasks.insert', text);` instead of `TasksCollection.insert`. Remember to fix your imports as well.

`imports/ui/TaskForm.jsx`
```js
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const TaskForm = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    Meteor.call('tasks.insert', text);

    setText('');
  };
  ..
};
```

See that your `TaskForm` component does not need to receive the user anymore as we get the `userId` in the server.

In the `App` file you should call `Meteor.call('tasks.setIsChecked', _id, !isChecked);` instead of `TasksCollection.update` and `Meteor.call('tasks.remove', _id)` instead of `TasksCollection.remove`.

Remember to also remove the user property from your `<TaskForm />`

`imports/ui/App.jsx`
```js
import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call('tasks.setIsChecked', _id, !isChecked);

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
..

            <TaskForm />
..
```

Now your inputs and buttons will start working again. What you gained?

1. When we insert tasks into the database, we can securely verify that the user is authenticated; the `createdAt` field is correct; and the `userId` is legitimate.
1. We can add extra validation logic to the methods later if we want.
1. Our client code is more isolated from our database logic. Instead of a lot of stuff happening in our event handlers, we have methods callable from anywhere.

## 8.4: api and db folders

We would like to take a moment here to think, the folder where the collection file is located is `api` but API in your project means a communication layer between server and client but the collection is not performing this role anymore. So you should move your `TasksCollection` file to a new folder called `db`.

This change is not required but it's recommended to keep our names consistent with the reality.

Remember to fix your imports, you have 4 imports to `TasksCollection` in the following files:
- `imports/api/tasksMethods.js`
- `imports/ui/TaskForm.jsx`
- `imports/ui/App.jsx`
- `server/main.js`

they should be changed from `import { TasksCollection } from '/imports/api/TasksCollection';` to `import { TasksCollection } from '/imports/db/TasksCollection';`.

Your app should look exactly as before as we didn't change anything that is visible for the user in this step. You can use [Meteor DevTools](https://chrome.google.com/webstore/detail/meteor-devtools-evolved/ibniinmoafhgbifjojidlagmggecmpgf) to see the messages going to your server and the results coming back, this information is available in the tab `DDP`.

> DDP is the protocol behind Meteor communication layer, you can learn more about it [here](https://github.com/meteor/meteor/blob/devel/packages/ddp/DDP.md)

We recommend that you change your `check` calls for wrong types to produce some errors, then you could understand what will happen in these cases as well.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step08) 

In the next step we are going to start using Publications to just publish the data that is necessary on each case.
