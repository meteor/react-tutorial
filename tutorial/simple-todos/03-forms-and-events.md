---
title: "3: Forms and Events"
---

All apps need to allow the user to perform some types of interaction with the data that is stored. In our case, the first type of interaction is to insert new tasks, or our app would not have much value, would it?

One of the main ways in which a user can insert or edit data in a website is through forms, in most cases it is a good idea to use the `<form>` tag since it gives semantic meaning to the elements inside it.

## 3.1: Create Task Form

First we need to create a simple form component to encapsulate our logic. As you can see we set up the `useState` React Hook.

Please note the _array destructuring_ `[text, setText]`, where `text` is the stored value which we want to use, which in this case will be a _string_; and `setText` is a _function_ used to update that value.

`imports/ui/TaskForm.jsx`
```javascript
import React, { useState } from 'react';
 
export const TaskForm = () => {
  const [text, setText] = useState("");
 
  return (
    <form className="task-form">
      <input
        type="text"
        placeholder="Type to add new tasks"
      />
 
      <button type="submit">Add Task</button>
    </form>
  );
};
```

## 3.2: Update the App component

Then we can simply add this to our `App` component:

`imports/ui/App.jsx`
```javascript
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import Tasks from '/imports/api/tasks';
import { TaskForm } from './TaskForm';
 
export const App = () => {
  const tasks = useTracker(() => Tasks.find({}).fetch());
  ..
      <ul>
        { tasks.map(task => <Task key={ task._id } task={ task }/>) }
      </ul>
 
      <TaskForm/>
    </div>
  );
};
```

## 3.3: Update the Stylesheet

You also can style it, for now we only need some margin at the top so the form doesn't seem a little off the mark.

`client/main.css`
```css
  padding: 10px;
  font-family: sans-serif;
}
 
.task-form {
  margin-top: 1rem;
}
```

## 3.4: Add Submit Handler

Now we can attach our submit handler to our form using the `onSubmit` event; and also plug our React Hook into the `onChange` event present in our input element.

As you can see we are using the `useState` React Hook to store the `value` of our `<input>` element. Note that we also need to set our `value` attribute to the `text` constant as well, this will allow the `input`element to stay in sync with our hook.

> In more complex applications you might want to implement some `debounce` or `throttle` logic if there are too many calculations happening between potentially frequent events like `onChange`. There are libraries which will help you with this, like [Lodash](https://lodash.com/), for instance.

`imports/ui/TaskForm.jsx`
```javascript
import React, { useState } from 'react';
import Tasks from '/imports/api/tasks';
 
export const TaskForm = () => {
  const [text, setText] = useState("");
 
  const handleSubmit = () => {
    if (!text) return;
 
    Tasks.insert({
      text: text.trim(),
      createdAt: new Date()
    });
 
    setText("");
  };
 
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
 
      <button type="submit">Add Task</button>
```

## 3.5: Show Newest Tasks First

Now we just need to make a change which will make our hypothetical user very happy: we need to show the newest tasks first. We can accomplish quite quickly by sorting our [Mongo](https://guide.meteor.com/collections.html#mongo-collections) query.

`imports/ui/App.jsx`
```javascript
import { TaskForm } from './TaskForm';
 
export const App = () => {
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());
 
  return (
    <div>
```
