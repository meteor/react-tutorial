---
title: "1: Creating the app"
---

## 1.1: Install Meteor
First we need to install Meteor.

If you running on OSX or Linux run this command in your terminal:
```shell
curl https://install.meteor.com/ | sh
```

If you are on Windows:
First install [Chocolatey](https://chocolatey.org/install), then run this command using an Administrator command prompt:
```shell
choco install meteor
```

> You can check more details about Meteor installation [here](https://www.meteor.com/install)

## 1.2: Create Meteor Project

The easiest way to setup Meteor with React is by using the command `meteor create` with the option `--react` and your project name:

```
meteor create --react simple-todos-react
```

Meteor will create all the necessary files for you. 

The files located in the `client` directory are setting up your client side (web), you can see for example `client/main.jsx` where Meteor is rendering your App main component into the HTML.

Also, check the `server` directory where Meteor is setting up the server side (Node.js), you can see the `server/main.js` is initializing your MongoDB database with some data. You don't need to install MongoDB as Meteor provides an embedded version of it ready for you to use.

You can now run your Meteor app using: 

```
meteor run
```

Don't worry, Meteor will keep your app in sync with all your changes from now on.

Your React code will be located inside the `imports/ui` directory, and `App.jsx` file is the root component of your React To-do app.

Take a quick look in all the files created by Meteor, you don't need to understand them now but it's good to know where they are.

## 1.3: Create Task Component

You will make your first change now. Create a new file called `Task.jsx` in your `ui` folder.

This file will export a React component called `Task` that will represent one task in your To-Do list. 

`imports/ui/Task.jsx`
```js
import React from 'react';
 
export const Task = ({ task }) => {
  return <li>{task.text}</li>
};
```

As this component will be inside a list you are returning a `li` element.

## 1.3: Create Sample Tasks

As you are not connecting to your server and your database yet let's define some sample data which will be used shortly to render a list of tasks. It will be an array, and you can call it `tasksData`.

`imports/ui/App.jsx`
```js
import React from 'react';
 
const tasksData = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];
 
export const App = () => ...
```

You can put anything as your `text` property on each task. Be creative!

## 1.4: Render Sample Tasks

Now we can implement some simple rendering logic with React. We can now use our previous `Task` component to render our list items.

In React you can use `{` `}` to write Javascript code between them.

See below that you will use a `.map` function from the `Array` object to iterate over your sample tasks.

`imports/ui/App.jsx`
```js
import React from 'react';
import { Task } from './Task';
 
const tasksData = ..;

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
 
    <ul>
      { tasksData.map(task => <Task key={ task._id } task={ task }/>) }
    </ul>
  </div>
);
```

Remember to add the `key` property to your task, otherwise React will emit a warning as it will see many components of the same type as siblings and without a key it will be hard to React to re-render one of them if necessary 

> You can read more about React and Keys [here](https://reactjs.org/docs/lists-and-keys.html#keys).
