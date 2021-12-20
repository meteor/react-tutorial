---
title: '7: Adding User Accounts'
---

## 7.1: Password Authentication

Meteor already comes with a basic authentication and account management system out of the box, so you only need to add the `accounts-password` to enable username and password authentication:

```
meteor add accounts-password
```

> There are many more authentication methods supported. You can read more about the accounts system [here](https://docs.meteor.com/api/accounts.html).

We also recommend you to install `bcrypt` node module, otherwise you are going to see a warning saying that you are using pure-Javascript implementation of it.

```
meteor npm install --save bcrypt
```

> You should always use `meteor npm` instead of only `npm` so you always use the `npm` version pinned by Meteor, this helps you to avoid problems due to different versions of npm installing different modules.

## 7.2: Create User Account

Now you can create a default user for our app, we are going to use `meteorite` as username, we just create a new user on server startup if we didn't find it in the database.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';

..

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  ..
});
```

You should not see anything different in your app UI yet.

## 7.3: Login Form

You need to provide a way for the users to input the credentials and authenticate, for that we need a form.

We can implement it using `useState` hook. Create a new file called `LoginForm.jsx` and add a form to it. You should use `Meteor.loginWithPassword(username, password);` to authenticate your user with the provided inputs.

`imports/ui/LoginForm.jsx`

```js
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password);
  };

  return (
    <form onSubmit={submit} className="login-form">
      <label htmlFor="username">Username</label>

      <input
        type="text"
        placeholder="Username"
        name="username"
        required
        onChange={e => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>

      <input
        type="password"
        placeholder="Password"
        name="password"
        required
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Log In</button>
    </form>
  );
};
```

Ok, now you have a form, let's use it.

## 7.4: Require Authentication

Our app should only allow an authenticated user to access its task management features.

We can accomplish that returning the `LoginForm` component when we don't have an authenticated user, otherwise we return the form, filter, and list component.

You should first wrap the 3 components (form, filter and list) in a `<Fragment>`, Fragment is a special component in React that you can use to group components together without affecting your final DOM, it means without affecting your UI as it is not going to introduce other elements in the HTML.

> Read more about Fragments [here](https://reactjs.org/docs/fragments.html)

So you can get your authenticated user or null from `Meteor.user()`, you should wrap it in a `useTracker` hook for it to be reactive. Then you can return the `Fragment` with Tasks and everything else or `LoginForm` based on the user being present or not in the session.

`imports/ui/App.jsx`

```js
import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

..
export const App = () => {
  const user = useTracker(() => Meteor.user());

  ..
  return (
      ..
      <div className="main">
        {user ? (
          <Fragment>
            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
..
```

## 7.5: Login Form style

Ok, let's style the login form now:

Wrap your pairs of label and input in `div`s so it will easier to control it on CSS. Do the same to the button tag.

`imports/ui/LoginForm.jsx`

```jsx
<form onSubmit={submit} className="login-form">
  <div>
    <label htmlFor="username">Username</label>

    <input
      type="text"
      placeholder="Username"
      name="username"
      required
      onChange={(e) => setUsername(e.target.value)}
    />
  </div>

  <div>
    <label htmlFor="password">Password</label>

    <input
      type="password"
      placeholder="Password"
      name="password"
      required
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  <div>
    <button type="submit">Log In</button>
  </div>
</form>

```

And then update the CSS:

`client/main.css`

```css
.login-form {
  display: flex;
  flex-direction: column;
  height: 100%;

  justify-content: center;
  align-items: center;
}

.login-form > div {
  margin: 8px;
}

.login-form > div > label {
  font-weight: bold;
}

.login-form > div  > input {
  flex-grow: 1;
  box-sizing: border-box;
  padding: 10px 6px;
  background: transparent;
  border: 1px solid #aaa;
  width: 100%;
  font-size: 1em;
  margin-right: 16px;
  margin-top: 4px;
}

.login-form > div > input:focus {
  outline: 0;
}

.login-form > div > button {
  background-color: #62807e;
}
```

Now your login form should be centralized and beautiful.

## 7.6: Server startup

Every task should have an owner from now on. So go to your database, as you learn before, and remove all the tasks from there:

`db.tasks.remove({});`

Change your `server/main.js` to add the seed tasks using your `meteorite` user as owner.

Make sure you restart the server after this change so `Meteor.startup` block will run again. This is probably going to happen automatically any way as you are going to make changes in the server side code.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});
```

See that we are using a new field called `userId` with our user `_id` field, we are also setting `createdAt` field.

## 7.7: Task owner

Now you can filter the tasks in the UI by the authenticated user. Use the user `_id` to add the field `userId` to your Mongo selector when getting the tasks from Mini Mongo.

`imports/ui/App.jsx`

```js
..
    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    const tasks = useTracker(() => {
      if (!user) {
        return [];
      }

      return TasksCollection.find(
        hideCompleted ? pendingOnlyFilter : userFilter,
        {
          sort: { createdAt: -1 },
        }
      ).fetch();
    });

    const pendingTasksCount = useTracker(() => {
      if (!user) {
        return 0;
      }

      return TasksCollection.find(pendingOnlyFilter).count();
    });
..

    <TaskForm user={user} />
..
```

Also update the `insert` call to include the field `userId` in the `TaskForm`. You should pass the user from the `App` component to the `TaskForm`.

`imports/ui/TaskForm.jsx`
```js
..
export const TaskForm = ({ user }) => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    TasksCollection.insert({
      text: text.trim(),
      createdAt: new Date(),
      userId: user._id
    });

    setText('');
  };
..
```

## 7.8: Log out

We also can better organize our tasks by showing the username of the owner below our app bar. You can include a new `div` right after our `Fragment` start tag.

On this you can add an `onClick` handler to logout the user as well. It is very straightforward, just call `Meteor.logout()` on it.

`imports/ui/App.jsx`

```js
..
  const logout = () => Meteor.logout();

  return (
..
    <Fragment>
      <div className="user" onClick={logout}>
        {user.username} 🚪
      </div>
..
```

Remember to style your user name as well.

`client/main.css`

```css
.user {
  display: flex;

  align-self: flex-end;

  margin: 8px 16px 0;
  font-weight: bold;
}
```

Phew! You have done quite a lot in this step. Authenticated the user, set the user in the tasks and provided a way for the user to log out.

Your app should look like this:

<img width="200px" src="/simple-todos/assets/step07-login.png"/>
<img width="200px" src="/simple-todos/assets/step07-logout.png"/>

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step07) 

In the next step we are going to start using Methods to only change the data after checking some conditions.
