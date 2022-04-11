---
title: '12: Testing'
---

Now we've created a few features for our application, let's add a test to ensure that we don't regress and that it works the way we expect.

We'll write a test that executes one of our Methods and verifies that it works correctly.

## 12.1: Install Dependencies

We'll add a test driver for the Mocha JavaScript test framework, along with a test assertion library:

```
meteor add meteortesting:mocha
meteor npm install --save-dev chai
```

We can now run our app in "test mode" by running meteor test and specifying a test driver package (you'll need to stop the regular app from running, or specify an alternate port with --port XYZ):

```
TEST_WATCH=1 meteor test --driver-package meteortesting:mocha
```

It should output something like this:

```
simple-todos-react
  ✓ package.json has correct name
  ✓ server is not client

2 passing (10ms)
```

Where are these two tests coming from? Every new Meteor application includes a `tests/main.js` module containing several example tests using the `describe`, `it`, and `assert` style popularized by testing frameworks like Mocha.

> Meteor Mocha integration is maintained by the community, you can read more [here](https://github.com/meteortesting/meteor-mocha)

When you run with these options, you can also see the results of the tests in the app URL in your browser:

<img width="500px" src="/simple-todos/assets/step12-test-report.png"/>

## 12.2: Scaffold Test

However, if you would prefer to split your tests across multiple modules, you can do that too. Add a new test module called `imports/api/tasksMethods.tests.js`.

`imports/api/tasksMethods.tests.js`

```js
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      it('can delete owned task', () => {});
    });
  });
}
```

And import it on `tests/main.js` like `import '/imports/api/tasksMethods.tests.js';` and delete everything else from this file as we don't need these tests:

`tests/main.js`

```js
import '/imports/api/tasksMethods.tests.js';
```

## 12.3: Prepare Database

In any test you need to ensure the database is in the state we expect before beginning. You can use Mocha's `beforeEach` construct to do that easily:

`imports/api/tasksMethods.tests.js`

```js
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { TasksCollection } from '/imports/db/TasksCollection';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        TasksCollection.remove({});
        taskId = TasksCollection.insert({
          text: 'Test Task',
          createdAt: new Date(),
          userId,
        });
      });
    });
  });
}
```

Here you are creating a single task that's associated with a random userId that'll be different for each test run.

## 12.4: Test Task Removal

Now you can write the test to call the `tasks.remove` method as that user and verify the task got deleted, as you are going to test a method and we want to mock the authenticated user you can install this utility package to make your life easier:

```shell
meteor add quave:testing
```

`imports/api/tasks.tests.js`

```js
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        TasksCollection.remove({});
        taskId = TasksCollection.insert({
          text: 'Test Task',
          createdAt: new Date(),
          userId,
        });
      });

      it('can delete owned task', () => {
        mockMethodCall('tasks.remove', taskId, { context: { userId } });

        assert.equal(TasksCollection.find().count(), 0);
      });
    });
  });
}
```

Remember to import `assert` from `chai` (`import { assert } from 'chai';`)

## 12.5: More tests

You can add as many tests you want, below you can find a few other tests that can be helpful for you to have more ideas of what to test and how.:

`imports/api/tasks.tests.js`

```js
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        TasksCollection.remove({});
        taskId = TasksCollection.insert({
          text: 'Test Task',
          createdAt: new Date(),
          userId,
        });
      });

      it('can delete owned task', () => {
        mockMethodCall('tasks.remove', taskId, { context: { userId } });

        assert.equal(TasksCollection.find().count(), 0);
      });

      it(`can't delete task without an user authenticated`, () => {
        const fn = () => mockMethodCall('tasks.remove', taskId);
        assert.throw(fn, /Not authorized/);
        assert.equal(TasksCollection.find().count(), 1);
      });

      it(`can't delete task from another owner`, () => {
        const fn = () =>
          mockMethodCall('tasks.remove', taskId, {
            context: { userId: 'somebody-else-id' },
          });
        assert.throw(fn, /Access denied/);
        assert.equal(TasksCollection.find().count(), 1);
      });

      it('can change the status of a task', () => {
        const originalTask = TasksCollection.findOne(taskId);
        mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
          context: { userId },
        });

        const updatedTask = TasksCollection.findOne(taskId);
        assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
      });

      it('can insert new tasks', () => {
        const text = 'New Task';
        mockMethodCall('tasks.insert', text, {
          context: { userId },
        });

        const tasks = TasksCollection.find({}).fetch();
        assert.equal(tasks.length, 2);
        assert.isTrue(tasks.some(task => task.text === text));
      });
    });
  });
}
```

If you run the test command again or left it running in watch mode before, you should see the following output:

```
Tasks
  methods
    ✓ can delete owned task
    ✓ can't delete task without an user authenticated
    ✓ can't delete task from another owner
    ✓ can change the status of a task
    ✓ can insert new tasks

5 passing (70ms)
```

To make it easier to type the test command, you may want to add a shorthand to the `scripts` section of your `package.json` file.

In fact, new Meteor apps come with a few preconfigured npm scripts, which you are welcome to use or modify.

The standard `meteor npm test` command runs the following command:

```
meteor test --once --driver-package meteortesting:mocha
```

This command is suitable for running in a Continuous Integration (CI) environment such as [Travis CI](https://travis-ci.org/) or [CircleCI](https://circleci.com/), since it runs only your server-side tests and then exits with `0` if all the tests passed.

If you would like to run your tests while developing your application (and re-run them whenever the development server restarts), consider using `meteor npm run test-app`, which is equivalent to:

```
TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha
```

This is almost the same as the earlier command, except that it also loads your application code as normal (due to `--full-app`), allowing you to interact with your app in the browser while running both client and server tests.

There's a lot more you can do with Meteor tests! You can read more about it in the Meteor Guide [article on testing](https://guide.meteor.com/testing.html).

> Review: you can check how your code should be at the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step12) 

In the next step, we are going to deploy your app to Galaxy, the best hosting for Meteor apps, developed by the same team behind Meteor.
