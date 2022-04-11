---
title: "3: Using GraphQL to get Data"
---

## 3.1 Query to Get Tasks

To write queries and mutations you are going to use `gql` and so install `graphql-tag`.

```shell
meteor npm install graphql-tag
```

Now let's start from the server side by creating a new `TaskSchema` and a new `TaskResolvers` to our tasks.

`imports/api/graphql.js`

```js
..
import { TasksCollection } from "../db/TasksCollection";
..
const TaskSchema = `
  type Query {
    tasks: [Task]
  } 
  
  type Task {
    _id: ID!
    text: String
    createdAt: String
    isChecked: Boolean
    user: User
  }
`;

const TaskResolvers = {
  Query: {
    async tasks(root, args, { userId }) {
      if (!userId) {
        return null;
      }
      return TasksCollection.find({ userId }, { sort: { createdAt: -1 } });
    },
  },
  Task: {
    user({ userId }) {
      return Meteor.users.findOne(userId);
    }
  }
};

startGraphQLServer({
  typeDefs: [UserSchema, TaskSchema],
  resolvers: [UserResolvers, TaskResolvers],
  log
});
```

For the client side, let's create a query to get our tasks and update our `App` to merge the data coming from the GraphQL with the data coming from the subscription.

To call a query we can use the hook `useQuery` from `@apollo/react-hooks`.


`imports/ui/App.jsx`

```js
..
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
..
const tasksQuery = gql`
  query Tasks {
    tasks {
      _id
      text
    }
  }
`;

export const App = () => {
  ..
  const  {  data, loading } = useQuery(tasksQuery)

  const { tasksStatus, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasksStatus: [], pendingTasksCount: 0 };
    ..
    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }
    const tasksStatus = TasksCollection.find(
    ..
    return { tasksStatus, pendingTasksCount };
  });
  ..
  const tasksData = data && data.tasks || [];
  const tasks = tasksData.map(({ _id, ...rest }) => ({
    _id,
    ...rest,
    isChecked: (tasksStatus.find(t => t._id === _id) || {}).isChecked,
  }));
  ..
```

Notice that in the query `tasksQuery` we just need the `_id` and the `text` as the `isChecked` is coming from the subscription, and we used the `createdAt` to sort the tasks on the server side, so we don't need it in the client side.

Now our tasks, fetched with GraphQL, have their status again, and the tasks' status was fetched with a subscription. When you do the changes and refresh your app again, all the tasks' text should now be visible. 

## 3.2 Refetching Queries

Everything seems to be working, but our app has a big problem.

If you try to add or remove a task, nothing will happen until you refresh the page after the action.

Everything was working before (and still it is with the toggle) because we were getting the tasks using the `useTracker` that will automatically fetch the data again if something changes. But now, we're getting the tasks with GraphQL and after an action that changes something in the background, we need a way to call the query again. With GraphQL, we have a couple of ways of doing it.

For now, let's use the function `refetch` that's returned from the hook `useQuery`, alongside the `data` and the `loading`.

We'll need to pass forward this function to the `TaskForm` so we can call the query again as soon as the user adds a new task, and we need to call this function well someone tries to delete a task. The easiest way will be to move the delete function inside the `App` component.

`imports/ui/App.jsx`

```js
..
export const App = () => {
  ..
  const  { loading, data, refetch } = useQuery(tasksQuery)
  ..
  const logout = () => Meteor.logout();

  const deleteTask = ({ _id }) => {
    Meteor.call('tasks.remove', _id);
    refetch();
  };

  return (
    <div className="app">
      ..
      <div className="main">
            ..
            <TaskForm refetch={refetch}/>
            ..
      </div>
    </div>
  );
};

```

Now for the `TaskForm`:

`imports/ui/TaskForm.jsx`

```js
..
export const TaskForm = ({ refetch }) => {
  ..
  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    Meteor.call('tasks.insert', text);

    setText('');
    refetch();
  };
  ..
};
```

Everything should be working again.

> Review: you can check how your code should be at the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos-graphql/step03)

In the next step we'll see how to use a mutation.
