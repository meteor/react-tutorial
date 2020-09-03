---
title: "6: Adding User Accounts"
---

## 6.1: Password Authentication

Meteor already comes with a basic authentication and account management system out of the box, so we only need to run a single command to enable username and password authentication:

```
meteor add accounts-password
```

> There are many more authentication methods supported. You can read more about the accounts system [here](https://docs.meteor.com/api/accounts.html).


## 6.2: Install BCrypt

You might get a warning saying that you are using a pure-JavaScript implementation of _bcrypt_. To fix that you can just run the following command:

```
meteor npm install --save bcrypt
```

## 6.3: Create User Account

Now we can create a default user for our app, if we do not find the `meteorite` username, we just create a new one.

`server/main.js`
```javascript
import Tasks from '/imports/api/tasks';
 
Meteor.startup(() => {
  if (!Accounts.findUserByUsername('meteorite')) {
    Accounts.createUser({
      username: 'meteorite',
      password: 'password'
    });
  }
 
  if (Tasks.find().count() === 0) {
    [
      'First Task',
```

## 6.4: Login Form

We need to input the credentials and authenticate the user at some point, for that we need a form.

We can implement a very simple one using `useState` hooks.

`imports/ui/LoginForm.jsx`
```javascript
import React, { useState } from 'react';
 
export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 
  const submit = (e) => {
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
 
          onChange={(e) => setUsername(e.currentTarget.value)}
      />
 
      <label htmlFor="password">Password</label>
 
      <input
          type="password"
          placeholder="Password"
          name="password"
          required
 
          onChange={(e) => setPassword(e.currentTarget.value)}
      />
 
      <button type="submit">Log In</button>
    </form>
  );
};
```

## 6.5: Require Authentication

Our app should only allow an authenticated user to access its task management features.

We can accomplish that quite easily.

`imports/ui/App.jsx`
```javascript
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
 
const toggleChecked = ({ _id, isChecked }) => {
  Tasks.update(_id, {
...some lines skipped...
    _.set(filter, 'checked', false);
  }
 
  const { tasks, incompleteTasksCount, user } = useTracker(() => ({
    tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count(),
    user: Meteor.user(),
  }));
 
  if (!user) {
    return (
      <div className="simple-todos-react">
        <LoginForm/>
      </div>
    );
  }
 
  return (
    <div className="simple-todos-react">
      <h1>Todo List ({ incompleteTasksCount })</h1>
```

## 6.6: Basic Styling

Now we add some basic styling, so our app gets more welcoming.

`client/main.css`
```css
.simple-todos-react .task-form input {
  flex-grow: 1;
}
 
.simple-todos-react .login-form {
  margin-top: 2rem;
}
 
.simple-todos-react .login-form label,
.simple-todos-react .login-form input {
  display: block;
  width: 100%;
  box-sizing: border-box;
}
 
.simple-todos-react .login-form label {
  margin-bottom: .4rem;
}
 
.simple-todos-react .login-form input {
  margin-bottom: .8rem;
}
 
.simple-todos-react .login-form button[type=submit] {
  float: right;
}
```

## 6.7: Task Owner

In order to better manage our tasks, every task should have an owner.

`imports/ui/TaskForm.jsx`
```javascript
import React, { useState } from 'react';
import Tasks from '/imports/api/tasks';
 
export const TaskForm = ({ user }) => {
  const [text, setText] = useState("");
 
  const handleSubmit = () => {
...some lines skipped...
 
    Tasks.insert({
      text: text.trim(),
      createdAt: new Date(),
      owner: user._id,
    });
 
    setText("");
```

## 6.8: Task Owner Username

We also can better organize our tasks by showing the username of the owner.

`imports/ui/App.jsx`
```javascript
        />) }
      </ul>
 
      <TaskForm user={user}/>
    </div>
  );
};
```
