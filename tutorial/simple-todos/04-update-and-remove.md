---
title: "4: Update and Remove"
---

Up until now you have only inserted documents into our collection. Let's take a look at how you can update and remove them by interacting with the user interface.

## 4.1: Add Checkbox

First, you need to add a `checkbox` element to your `Task` component.
 
> Be sure to add the `readOnly` attribute since we are not using `onChange` to update the state.
 
> We also have to force our `checked` prop to a `boolean` since React understands that an `undefined` value as inexistent, therefore causing the component to switch from uncontrolled to a controlled one.

> You are also invited to experiment and see how the app behaves for learning purposes.

You also want to receive a callback, a function that will be called when the checkbox is clicked.

`imports/ui/Task.jsx`
```js
import React from 'react';
 
export const Task = ({ task, onCheckboxClick }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={ !!task.isChecked }
        onClick={ () => onCheckboxClick(task) }
        readOnly
      />
      <span>{ task.text }</span>
    </li>
  );
};
```

## 4.2: 

Now we can update our task document toggling its state from `checked: false` to `checked: true` and vice-versa.

`imports/ui/App.jsx`
```js
import Tasks from '/imports/api/tasks';
import { TaskForm } from './TaskForm';
 
const toggleChecked = ({ _id, isChecked }) => {
  Tasks.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};
 
export const App = () => {
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 
...some lines skipped...
      <h1>Welcome to Meteor!</h1>
 
      <ul>
        { tasks.map(task => <Task key={ task._id } task={ task } onCheckboxClick={toggleChecked} />) }
      </ul>
 
      <TaskForm/>
```

## 4.3: 

We can remove our task with just a few lines of code.

`imports/ui/Task.jsx`
```js
import React from 'react';
 
export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <li>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <input
        type="checkbox"
        checked={ Boolean(task.isChecked) }
```

## 4.4: 

Our user interface up until this point has looked quite ugly. Let's add some basic styling which will serve as the foundation for a more professional looking app.

First, let's install the `classnames` package which helps us manage conditional styling:

```
npm i classnames
```

`imports/ui/App.jsx`
```js
const deleteTask = ({ _id }) => Tasks.remove(_id);
 
export const App = () => {
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 
...some lines skipped...
      <h1>Welcome to Meteor!</h1>
 
      <ul>
        { tasks.map(task => <Task
          key={ task._id }
          task={ task }
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask}
        />) }
      </ul>
 
      <TaskForm/>
```

## 4.5: 

If our task is `checked` then the respective class will be applied to it.

`client/main.css`
```css
.simple-todos-react {
  margin: 0 auto;
  max-width: 512px;
}
 
.simple-todos-react .tasks {
  padding: 0;
  margin: 0;
  list-style: none;
}
 
.simple-todos-react .tasks .task {
  display: flex;
  align-items: center;
  height: 32px;
}
 
.simple-todos-react .tasks .task span {
  flex-grow: 1;
}
 
.simple-todos-react .tasks .task button {
  cursor: pointer;
  background: transparent;
  outline: none;
  border: none;
}
 
.simple-todos-react .tasks .task.checked span {
  text-decoration: line-through;
}
 
.simple-todos-react .task-form {
  margin-top: 1rem;
  display: flex;
}
 
.simple-todos-react .task-form input {
  flex-grow: 1;
}
```

## 4.6: 

Let's add proper classes to our parent elements.

`imports/ui/Task.jsx`
```js
import React from 'react';
import classnames from 'classnames';
 
export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const classes = classnames('task', {
    'checked': Boolean(task.isChecked)
  });
 
  return (
    <li className={classes}>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
      <span>{ task.text }</span>
      <input
        type="checkbox"
        checked={ Boolean(task.isChecked) }
        onClick={ () => onCheckboxClick(task) }
        readOnly
      />
    </li>
  );
};
```

## 4.7: Update the styling

Finally, we add the CSS styling which will normalize and differentiate our checked tasks visually.

> You can learn more about CSS Flexible Box Module [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox).

`imports/ui/App.jsx`
```js
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 
  return (
    <div className="simple-todos-react">
      <h1>Welcome to Meteor!</h1>
 
      <ul className="tasks">
        { tasks.map(task => <Task
          key={ task._id }
          task={ task }
```

Now we have a proper style foundation, nothing fancy, but we have the right semantics in place.
