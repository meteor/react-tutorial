---
title: "5: Hooks"
---

In this step we will store some state using React Hooks.

## 5.1: Add State Hook

First we need to import the `useState` function from the React library. Afterwards we initialize the hook with `false`.

The `useState` function returns an array pair, where the first element is our value, and the second is a setter function. Hence the _array destructuring_.

Bear in mind that the names used for the constants do not belong to the React API, you can name them whatever you like.

`imports/ui/App.jsx`
```js
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
...some lines skipped...
const deleteTask = ({ _id }) => Tasks.remove(_id);
 
export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
 
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 
  return (
```

You can read more about the `useState` hook [here](https://reactjs.org/docs/hooks-state.html).

## 5.2: Update the Application's Stylesheet

`client/main.css`
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
}
 
.simple-todos-react {
...some lines skipped...
  max-width: 512px;
}
 
.simple-todos-react .filters {
  margin-bottom: 1rem;
}
 
.simple-todos-react .tasks {
  padding: 0;
  margin: 0;
```

## 5.3: Add Filtering Checkbox

This is straightforward, but since it quite didn't look right we made some improvements to our styling as well. 

> Remember, we use the `Boolean` cast in case we have `undefined` values. We also use the `readOnly` attribute since we are not using `onChange`.

`imports/ui/App.jsx`
```js
    <div className="simple-todos-react">
      <h1>Welcome to Meteor!</h1>
 
      <div className="filters">
        <label>
          <input
              type="checkbox"
              readOnly
              checked={ Boolean(hideCompleted) }
              onClick={() => setHideCompleted(!hideCompleted)}
          />
          Hide Completed
        </label>
      </div>
 
      <ul className="tasks">
        { tasks.map(task => <Task
          key={ task._id }
```

## 5.4: Add the lodash Node package to the application

Meteor allows you to leverage all Node.js' ecosystem, including a well-known library called Lodash. This library helps us write code in a more declarative manner.

Not strictly necessary in this case, but it is a good idea for us to import only used functions for larger projects since not everything needs to be included in the final bundle files.

So, for simplicity we use `_` to namespace all of Lodash's functions.

```
meteor npm install --save-dev lodash
```

## 5.5: Filter Tasks

Now, if the user has selected the `checkbox` to hide completed tasks, we will include our `checked: false` clause to the query.

`imports/ui/App.jsx`
```js
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
import { TaskForm } from './TaskForm';
...some lines skipped...
const deleteTask = ({ _id }) => Tasks.remove(_id);
 
export const App = () => {
  const filter = {};
 
  const [hideCompleted, setHideCompleted] = useState(false);
 
  if (hideCompleted) {
    _.set(filter, 'checked', false);
  }
 
  const tasks = useTracker(() => Tasks.find(filter, { sort: { createdAt: -1 } }).fetch());
 
  return (
    <div className="simple-todos-react">
```

## 5.6: Render Count

Update the App component in order to calculate the number of incomplete tasks.

`imports/ui/App.jsx`
```js
    _.set(filter, 'checked', false);
  }
 
  const { tasks, incompleteTasksCount } = useTracker(() => ({
    tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
    incompleteTasksCount: Tasks.find({ checked: { $ne: true }}).count()
  }));
 
  return (
    <div className="simple-todos-react">
```

## 5.7: Render Count

Finally we just modify our header to display the render count.

`imports/ui/App.jsx`
```js
 
  return (
    <div className="simple-todos-react">
      <h1>Todo List ({ incompleteTasksCount })</h1>
 
      <div className="filters">
        <label>
```
