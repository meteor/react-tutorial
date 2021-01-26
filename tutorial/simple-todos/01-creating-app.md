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
meteor create simple-todos-react
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

## 1.4: Create Sample Tasks

As you are not connecting to your server and your database yet let's define some sample data which will be used shortly to render a list of tasks. It will be an array, and you can call it `tasks`.

`imports/ui/App.jsx`
```js
import React from 'react';
 
const tasks = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];
 
export const App = () => ...
```

You can put anything as your `text` property on each task. Be creative!

## 1.5: Render Sample Tasks

Now we can implement some simple rendering logic with React. We can now use our previous `Task` component to render our list items.

In React you can use `{` `}` to write Javascript code between them.

See below that you will use a `.map` function from the `Array` object to iterate over your sample tasks.

`imports/ui/App.jsx`
```js
import React from 'react';
import { Task } from './Task';
 
const tasks = ..;

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
 
    <ul>
      { tasks.map(task => <Task key={ task._id } task={ task }/>) }
    </ul>
  </div>
);
```

Remember to add the `key` property to your task, otherwise React will emit a warning because it will see many components of the same type as siblings. Without a key it will be hard for React to re-render one of them if necessary. 

> You can read more about React and Keys [here](https://reactjs.org/docs/lists-and-keys.html#keys).

Remove the `Hello` and `Info` from your `App` component, remember to also remove the imports for them in top of the file. Remove the `Hello.jsx` and `Info.jsx` files as well.

## 1.6 Mobile look

Let's see how your app is looking on Mobile. You can simulate a mobile environment by `right clicking` your app in the browser (we are assuming you are using Google Chrome, as it is the most popular browser today) and then `inspect`, this will open a new window inside your browser called `Dev Tools`. In the `Dev Tools` you have a small icon showing a Mobile device and a Tablet:

<img width="500px" src="/simple-todos/assets/step01-dev-tools-mobile-toggle.png"/>

Click on it and then select the phone that you want to simulate and in the top bar.

> You can also check your app in your cellphone. To do so, connect to your App using your local IP in the navigation browser of your mobile browser.
>
> This command should print your local IP for you on Unix systems at least
`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`

You will see something like this:

<img width="200px" src="/simple-todos/assets/step01-mobile-without-meta-tags.png"/>

As you can see everything is small as we are not adjusting the view port for mobile devices. You can fix this and other similar issues by adding these lines to your `client/main.html` file, inside the `head` tag, after the `title`.

`client/main.html`
```html
  <meta charset="utf-8"/>
  <meta http-equiv="x-ua-compatible" content="ie=edge"/>
  <meta
      name="viewport"
      content="width=device-width, height=device-height, viewport-fit=cover, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
  />
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
```

Now your app should look like this:

<img width="200px" src="/simple-todos/assets/step01-mobile-with-meta-tags.png"/>

## 1.7 Hot Module Replacement

Meteor by default when using React is already adding for you a package called `hot-module-replacement`. This package updates the javascript modules in a running app that were modified during a rebuild. Reduces the feedback cycle while developing so you can view and test changes quicker (it even updates the app before the build has finished). You are also not going to lose the state, the your app code will be updated and your state will be the same.

You should also add the package `dev-error-overlay` at this point so you can see the errors in your web browser.

```shell
meteor add dev-error-overlay
```

You can try to make some mistakes and then you are going to see the errors in the browser and not only in the console.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step01) 

In the next step we are going to work with our MongoDB database to store our tasks.
