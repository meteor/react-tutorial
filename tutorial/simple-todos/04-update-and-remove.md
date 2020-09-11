---
title: '4: Update and Remove'
---

Up until now you have only inserted documents into our collection. Let's take a look at how you can update and remove them by interacting with the user interface.

## 4.1: Add Checkbox

First, you need to add a `checkbox` element to your `Task` component.

> Be sure to add the `readOnly` attribute since we are not using `onChange` to update the state.
>
> We also have to force our `checked` prop to a `boolean` since React understands that an `undefined` value as inexistent, therefore causing the component to switch from uncontrolled to a controlled one.
>
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

Your app should look like this:

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

Your app should look like this:

<img width="200px" src="/simple-todos/assets/step04-delete-button.png"/>

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step04) 

In the next step we are going to improve the look of your app using CSS with Flexbox.
