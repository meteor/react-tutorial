---
title: "4: Using GraphQL to Change Data"
---

## 4.1 Using a Mutation

We couldn't create a tutorial with GraphQL without doing at least one mutation.

Let's create a mutation to insert tasks, and once more start with the server side. We'll insert a save function inside the `TasksCollection` object, so we can use it in more than one place.

`imports/db/TasksCollection.js`

```js
..
const tasksCollection = Object.assign(new Mongo.Collection('tasks'), {
  save({ text, userId }) {
    const newTaskId = this.insert({
      text,
      userId,
      createdAt: new Date(),
    });
    return this.findOne(newTaskId);
  }
});

export { tasksCollection as TasksCollection }
```

In this way, you can insert as many functions as you want to the collection object, and the cool part, besides calling those function from everywhere, is that the context of the `this` is your collection. So instead of calling `TasksCollection.insert` or `TasksCollection.findOne` you can call `this.insert` or `this.findOne`, respectively.

Now we can use the `save` function in a mutation. Let's create this mutation.

`imports/api/graphql.js`

```js
..
const TaskSchema = `
  ..
  type Mutation {
    addTask(text: String!): Task
  }
  ..
`;

const TaskResolvers = {
  ..
  Mutation: {
    addTask(root, {text}, {userId}) {
      if (!userId) {
        return null;
      }
      return TasksCollection.save({text, userId});
    }
  },
  ..
}
..
```

Now we can update the `TaskForm` to use our new mutation.

`imports/ui/TaskForm.jsx`

```js
import React, { useState } from 'react';
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const taskMutation =  gql`
  mutation AddTask($text: String!) {
    addTask(text: $text) {
      _id
    }
  }
`

export const TaskForm = () => {
  const [addTaskMutation] = useMutation(taskMutation);
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    addTaskMutation({
      variables: {
        text,
      },
      refetchQueries: () => ['Tasks']
    })
      .then(() => console.log('Task added with success'))
      .catch(e => console.error('Error trying to add task', e));

    setText('');
  };
  ..
```


You can notice some things on this code. The first one is that we don't need to call the function `refetch` anymore when adding a task. Now we can use the prop `refetchQueries` and to refetch queries when the mutation is called. The name `Tasks` used here is the same name used in our tasks query.

Other thing you may notice is that the function `addTaskMutation` is a Promise, so we can use call the functions `then` and `catch` to do some action when the function succeeds or fails. In our case we are just showing logging messages when something happens.

If you try to add a task now, everything should be working now, but before we wrap up, let's do some cleaning.

First, you can stop providing the function `refetch` to the component `<TaskForm />` inside `App.jsx`. Also, remove the method `tasks.insert` from `tasksMethods.`, as we don't need it anymore.

After removing this method, try to run the tests by stopping your app and running:

```shell
meteor test --once --driver-package meteortesting:mocha
```

You'll notice that the test `can insert new tasks` will fail as we don't have the method `tasks.insert` anymore. This can be easily fixed by just calling `TasksCollection.save` instead of trying to call the method.


`imports/api/tasksMethods.tests.js`

```js
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      ..
      it('can insert new tasks', () => {
        const text = 'New Task';
        TasksCollection.save({ text, userId });

        const tasks = TasksCollection.find({}).fetch();
        assert.equal(tasks.length, 2);
        assert.isTrue(tasks.some(task => task.text === text));
      });
    });
  });
}
```

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos-graphql/step04)
