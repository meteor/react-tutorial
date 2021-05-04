---
title: "1: GraphQL Set up"
---

Important: we are not recommending you to avoid Publications and Methods, the goal of this tutorial is just to teach you how to use Meteor with GraphQL in case you like both.

## 1.1: Install GraphQL packages

Start off by installing the package [quave:graphql](https://github.com/quavedev/graphql) following all the steps in the `Installation` section. The server and client set up we'll cover below.

This package uses Meteor (DDP)(https://github.com/meteor/meteor/blob/devel/packages/ddp/DDP.md) as data layer and Apollo as GraphQL implementation.

## 1.2 Set up server

Create a new file called `graphql.js` inside the `api` folder. This file will be the server entrypoint to our resolvers and schemas.

`imports/api/graphql.js`

```js
import { Meteor } from 'meteor/meteor';
import { startGraphQLServer } from 'meteor/quave:graphql/server';

const log = error => console.error('GraphQL server error', error);

const UserSchema = `
  type Query {
    loggedUser: User
  } 
  
  type User {
    _id: ID!
    username: String
  }
`;

const UserResolvers = {
  Query: {
    async loggedUser(root, args, { userId }) {
      if (!userId) {
        return null;
      }
      return Meteor.users.findOne(userId);
    },
  },
};

startGraphQLServer({ typeDefs: [UserSchema], resolvers: [UserResolvers], log });

```

The code inside this file is fairly simple. We have our schema inside the variable `UserSchema` and we have our resolver inside our variable `UserResolvers`. Then, we provide these data to the function `startGraphQLServer`, that is responsible for starting the GraphQL server, alongside with a log function that will be called every time we have an error with the GraphQL in the server side.

For now, we just have a `loggedUser` query that we'll test soon using the Apollo Dev Tools.

If you want to learn how schemas and resolvers works on GraphQL, you can check out their [docs](https://graphql.org/learn/).

Now, let's import this file inside our app server.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/graphql';
..
```

## 1.3 Set up client

Now let's set up our client. As we're working with React, we can use the Apollo react-hooks to be able to call our queries and mutation from the client.

Go ahead and install the package `@apollo/react-hooks`.

```shell
meteor npm install @apollo/react-hooks
```

Once this package is installed, let's change our main client file to use the `ApolloProvider`.


`client/main.js`

```js
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

import { startGraphQLClient } from 'meteor/quave:graphql/client';

import { ApolloProvider } from '@apollo/react-hooks';

const apolloClient = startGraphQLClient({ connectToDevTools: true });

Meteor.startup(() => {
  render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>,
    document.getElementById('react-target')
  );
});
```

Notice that when we're starting the GraphQL client (`startGraphQLClient()`), we're providing the attribute `connectToDevTools` as `true`. This attribute, when true, allows us to access the Apollo Dev Tools and call mutations and queries from there.

## 1.4 See Apollo Dev Tools working

If you still don't have the Apollo Dev Tools extension installed on your browser, you can check [here how to install it](https://www.apollographql.com/docs/react/development-testing/developer-tooling/#installation) on Chrome or Firefox.

Once it's installed, let's test our query `loggedUser`. With your app started, access your browser dev tools and under the tag `Apollo` you will see something like in the image below.

<img width="800px" src="/simple-todos-graphql/assets/step01-apollo-dev-tools-view.png"/>


Now, let's test the `loggedUser` query there. Click in the `GRAPHQL` tab, type the query below to it, and then press the run button.

```
query MyQuery {
    loggedUser {
        _id
        username
    }
}
```


<img width="800px" src="/simple-todos-graphql/assets/step01-testing-query.png"/>


Once you hit the run button, you should see something like in the image below.

<img width="800px" src="/simple-todos-graphql/assets/step01-query-result.png"/>

If you log out and then hit the run button again, you should see something like this:

<img width="800px" src="/simple-todos-graphql/assets/step01-query-no-result.png"/>

This shows that our app is now working with GraphQL.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos-graphql/step01)

In the next step we'll see how to load specific data to our Minimongo.
