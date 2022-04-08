---
title: '8: Adding Login with Github'
---

## 8.1: Github Authentication

Meteor comes with different third-party authentication methods and an account management system out of the box. We are going to use the `accounts-github` to be able to use your GitHub account to login to our app:

```
meteor add accounts-github
```

Also, add the `service-configuration` package to set up your Github secret keys:

```
meteor add service-configuration
```


> There are many more authentication methods supported. You can read more about the accounts system [here](https://docs.meteor.com/api/accounts.html).

## 8.2: Create Login with Github Button

Now we need to create a button component that the user will click to open a popup to log in with his Github account.
You should use `Meteor.loginWithGithub();` function and pass 2 arguments to it: `requestPermissions` and `loginStyle`, the first is to get the user information from Github, and the second is to open our popup.

`imports/ui/LoginWithGithub.jsx`

```js
import React from 'react';
import { Meteor } from 'meteor/meteor';

export const LoginWithGithub = () => {
  const handleGithubLogin = () => {
    Meteor.loginWithGithub({
      requestPermissions: ['user'],
      loginStyle: 'popup',
    });
  };

  return (
    <button type="button" className="github-btn" onClick={handleGithubLogin}>
      Login with Github
      <div>
        <svg fill="#000000" viewBox="0 0 30 30" width="20px" height="20px">
          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
        </svg>
      </div>
    </button>
  );
};
```
Also, let's add some style to it to look beautiful: 

`client/main.css`

```css
.github-btn {
  border: 1px solid #e1e5f0;
  background-color: #fff;
  width: 245px;
  margin: 0 auto 16px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.github-btn > div {
  margin-left: 4px;
}
```

## 8.3: Login Form

We need to import our new component into our `LoginForm.jsx`

`imports/ui/LoginForm.jsx`
```js
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { LoginWithGithub } from './LoginWithGithub';

export const LoginForm = () => {
  ...
  return (
    <form onSubmit={submit} className="login-form">
      <LoginWithGithub />
      ...
    </form>
  );
};
```

Your app should look like this: 
<div>
  <img width="200px" src="/simple-todos/assets/step08-github-login.png"/>
</div>

## 8.4: Github Credentials

In order to our Github login works, we need to get our Github Credentials first.
Register your OAuth Application [on this link](https://github.com/settings/applications/new) filling the `Application Name`, `Homepage URL`, and the `Authorization callback URL`, for both URLs you can use `http://localhost:3000` for now.
Click on `Register Application`.

On the next screen, grab your `Client ID` and click on `Generate a new client secret` and copy your new client secret.
We are going to use both of these keys to connect to Github.

Now, we need to configure our server to fully connect to Github, go to `server/main.js`, and import the `ServiceConfiguration` to add your Github credentials.

`server/main.js`
```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';
import { ServiceConfiguration } from 'meteor/service-configuration';

...

Meteor.startup(() => {
...
} 

ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      loginStyle: 'popup',
      clientId: '', // insert your clientId here
      secret: '', // insert your secret here
    },
  }
);
```

Awesome! You now have your Github authentication configured, you can try login in with your own Github account.

## 8.5: Fixing the display name

You will notice when you login into our Todo app, that your name is not appearing on the right corner next to the logout door button.
That happens because the data structure is a little bit different and we need to fix that.

The `user.username` is null in this case, so we need to grab the user information from `user.profile.name`.

`imports/ui/App.jsx`
```js
export const App = () => {
  ...
    {user ? (
      <Fragment>
        <div className="user" onClick={logout}>
          {user.username || user.profile.name} 🚪
        </div>

        <TaskForm user={user} />
...
```

And now you have everything working as before.

> Review: you can check how your code should be at the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step08) 

In the next step, we are going to start using Methods to only change the data after checking some conditions.