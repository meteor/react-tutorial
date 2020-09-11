---
title: '4: Update and Remove'
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
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
    </li>
  );
};
```

## 4.2: Toggle Checkbox

Now you can update your task document toggling its `isChecked` field.

Create a function to change your document and pass it along to your `Task` component.

`imports/ui/App.jsx`

```js
const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};

export const App = () => {
  ..
  <ul>
    { tasks.map(task => <Task key={ task._id } task={ task } onCheckboxClick={toggleChecked} />) }
  </ul>
  ..
```

Your app should looks like this:

<img width="200px" src="/simple-todos/assets/step04-checkbox.png"/>

## 4.3: Remove tasks

You can remove tasks with just a few lines of code.

First add a button after text in your `Task` component and receive a callback function.

`imports/ui/Task.jsx`

```js
import React from 'react';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
..
      <span>{task.text}</span>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
..
```

Now add the removal logic in the `App`, you need to have a function to delete the task and provide this function in your callback property in the `Task` component:

`imports/ui/App.jsx`

```js
const deleteTask = ({ _id }) => TasksCollection.remove(_id);

export const App = () => {
  ..
  <ul>
    { tasks.map(task => <Task
      key={ task._id }
      task={ task }
      onCheckboxClick={toggleChecked}
      onDeleteClick={deleteTask}
    />) }
  </ul>
  ..
}
```

## 4.4: Style it

Our user interface up until this point has looked quite ugly. Let's add some basic styling which will serve as the foundation for a more professional looking app.

First, let's install the `classnames` package which helps us manage conditional styling:

```
meteor npm install classnames
```

> You should always use `meteor npm` instead of only `npm` so you always use the `npm` version pinned by Meteor, this helps you to avoid problems due to different versions of npm installing different modules.

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

## 4.5: Applying styles

Now add the proper classes to our parent elements. Remember to import `classnames` with `import classnames from 'classnames';`, as it is not a Meteor package you shouldn't have `meteor/` before its name. 

`imports/ui/Task.jsx`

```js
import React from 'react';
import classnames from 'classnames';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const classes = classnames('task', {
    checked: !!task.isChecked,
  });

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
      ..
    </li>
  );
};
```

The code above using `classnames` will product the class name `checked` only when your task is checked.

Finally, you add the CSS styling which will normalize and differentiate your checked tasks visually.

> You can learn more about CSS Flexible Box Module [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox).

Add `simple-todos-react` to your main div on `App` component.

`imports/ui/App.jsx`

```js
  ..
  return (
    <div className="simple-todos-react">
      <h1>Welcome to Meteor!</h1>
  ..
```

> In React we use `className` instead of `class` as React uses Javascript to define the UI and `class` is a reserved word in Javascript.

Now we have a proper style foundation, nothing fancy, but we have the right semantics in place.
