---
title: "10: Testing"
---

Now we've created a few features for our application, let's add a test to ensure that we don't regress and that it works the way we expect.

We'll write a test which executes one of our Methods and verifies that it works correctly.

## 10.1: Install Dependencies

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

## 10.2: Scaffold Test

However, if you would prefer to split your tests across multiple modules, you can do that too. Let's add a new test module called `imports/api/tasks.tests.js`:

`imports/api/tasks.tests.js`
```javascript
import { Meteor } from 'meteor/meteor';
 
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      it('can delete owned task', () => {
      });
    });
  });
}
```

## 10.3: Prepare Database

In any test we need to ensure the database is in the state we expect before beginning. We can use Mocha's `beforeEach` construct to do that easily:

`imports/api/tasks.tests.js`
```javascript
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
 
import { Tasks } from './tasks.js';
 
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;
 
      beforeEach(() => {
        Tasks.remove({});
 
        taskId = Tasks.insert({
          text: 'Test Task',
          createdAt: new Date(),
          owner: userId,
          username: 'meteorite',
        });
      });
 
      it('can delete owned task', () => {
      });
    });
```

Here we create a single task that's associated with a random userId that'll be different for each test run.

## 10.4: Test Task Removal

Now we can write the test to call the `tasks.remove` method "as" that user and verify the task got deleted:

`imports/api/tasks.tests.js`
```javascript
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { Tasks } from './tasks.js';
 
...some lines skipped...
      });
 
      it('can delete owned task', () => {
        // Isolate internal method implementation.
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
 
        // Set up a fake method call context.
        const invocation = { userId };
 
        // Run the method with `this` set to the mock context.
        deleteTask.apply(invocation, [taskId]);
 
        // Check its behavior.
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
```

## 10.5: Import Test

The only remaining step is to import this new test module into the main `tests/main.js` module:

`tests/main.js`
```javascript
import assert from "assert";
 
import "../imports/api/tasks.tests.js";
 
describe("simple-todos-react", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
```

If you run the test command again or left it running in watch mode before, you should see the following output:

```
Tasks
  methods
    ✓ can delete owned task

simple-todos-react
  ✓ package.json has correct name
  ✓ server is not client

3 passing (120ms)
```

To make it easier to type the test command, you may want to add a shorthand to the "scripts" section of your `package.json` file.

In fact, new Meteor apps come with a few preconfigured npm scripts, which you are welcome to use or modify.

The standard `npm test` command runs the following command:

```
meteor test --once --driver-package meteortesting:mocha
```

This command is suitable for running in a Continuous Integration (CI) environment such as [Travis CI](https://travis-ci.org/) or [CircleCI](https://circleci.com/), since it runs only your server-side tests and then exits with 0 if all the tests passed.

If you would like to run your tests while developing your application (and re-run them whenever the development server restarts), consider using meteor npm run test-app, which is equivalent to:

```
TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha
```

This is almost the same as the earlier command, except that it also loads your application code as normal (due to `--full-app`), allowing you to interact with your app in the browser while running both client and server tests.

> There's a lot more you can do with Meteor tests! You can read more about it in the Meteor Guide [article on testing](https://guide.meteor.com/testing.html).
>
