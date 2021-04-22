---
title: "3: Using GraphQL to get Data"
---

## 3.1 Query to Get Tasks

To write queries and mutations you are going to use `gql` and so install `graphql-tag`.

```shell
meteor npm install graphql-tag
```

Now let's start from the server side by creating a new `TaskScrema` and a new `TaskResolvers` to our tasks.

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

Notice that in the query `tasksQuery` we just need the `_id` and the `text` as the `isChecked` is coming from the subscription, and we used the `createdAt` to sort the tasks in the server side, so we don't need it in the client side.

Now our tasks, fetched with GraphQL, have their status again, and the tasks' status were fetched with a subscription. When you do the changes and refresh your app again, all the tasks' text should now be visible. 

# 3.2 Refetching Queries

Everything seems to be working now
