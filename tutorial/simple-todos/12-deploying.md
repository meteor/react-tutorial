---
title: '12: Deploying'
---

Now your app is tested and ready to be published so anyone can use it.

The best place to run your Meteor app is [Galaxy](https://www.meteor.com/hosting). Galaxy offers free trial so you can use up to 4 GBs without any cost for 30 days. Cool, right?

> If you have any trouble on this step you should send an email to Galaxy support and they are going to help you, send your message to `support@meteor.com`. Try to explain in details what is the issue and you are going to receive help as soon as possible. Also make sure you include in the subject: `React Tutorial` so you know where are you coming from.

## 12.1: Create your account

Do you have a Meteor Developer Account? No? Ok, let's fix it.

Go to [www.meteor.com/sign-up](https://www.meteor.com/sign-up). You are going to see a form like this:

<img width="500px" src="/simple-todos/assets/step12-sign-up.png"/>

Fill the form and click in `Create an account`.

Done, your account is created. You can use this account to access [atmospherejs.com](https://atmospherejs.com/), [Forums](https://forums.meteor.com) and much more.

In the next step you will sign-up for Galaxy, you are going to see a form like this:

<img width="500px" src="/simple-todos/assets/step12-sign-up.png"/>

You can select `Individually` and click in `Continue`.

Last step, add your billing information and your credit card in a form like this:

<img width="500px" src="/simple-todos/assets/step12-credit-card.png"/>

And click on `Start your trial`.

Now you have a Meteor Developer Account and also access to Galaxy. Let's start your set up.

## 12.2: Set up MongoDB

As your app uses MongoDB the first step is to set up a MongoDB database, Galaxy does not offer MongoDB hosting, Galaxy hosts your app but not your database and so you need to create it somewhere else.

Here we list a few options:
- [ScaleGrid](https://scalegrid.io/mongodb.html): They offer 30 days free trial as well and you have guides [here](https://scalegrid.io/mongodb/demo.html);
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): They have a free plan;

In any provider, in the end, you are going to have a MongoDB URL.

ScaleGrid URL will be like this: `mongodb+srv://youruser:yourpassword@SG-yourname-12345.servers.mongodirector.com/yourdb`
MongoDB Atlas URL will be like this: `mongodb+srv://youruser:youserpassword@yourname.sdge2.mongodb.net/yourdb`

The MongoDB URL is very important, we will need it in the next part.

> You can read more about MongoDB set up [here](https://galaxy-guide.meteor.com/mongodb.html)

## 12.3: Set up settings

You need to create a setting file, it's a JSON file that Meteor apps can read the settings from. Create this file in a new folder called `private` in the root of your project. `private` is a special folder that is not going to be published to the client.

Make sure you replace `Your MongoDB URL` by your MongoDB URL :)

`private/settings.json`
```json
{
  "galaxy.meteor.com": {
    "env": {
      "MONGO_URL": "Your MongoDB URL"
    }
  }
}
```

Yes, that simple!

## 12.4: Deploy it

Now you are ready to deploy, make sure you run `meteor npm install` before deploying to make sure all your dependencies are installed.

You also need to choose a sub-domain to publish your app. We are going to use the main domain `meteorapp.com` that is free and included on any Galaxy plan.

In this example we are going to use `react-tutorial.meteorapp.com` but make sure you select a different one, otherwise you are going to receive an error saying it is already used.

> You can learn how to use custom domains on Galaxy [here](https://galaxy-guide.meteor.com/custom-domains.html) 

Run the deploy command:

```shell script
meteor deploy react-tutorial.meteorapp.com --settings private/settings.json
```

Make sure you replace `react-tutorial` by a custom name that you want as sub-domain.

You are going to see a log like this:

```shell script
meteor deploy react-tutorial.meteorapp.com --settings private/settings.json
Talking to Galaxy servers at https://us-east-1.galaxy-deploy.meteor.com
Preparing to build your app...                
Preparing to upload your app... 
Uploaded app bundle for new app at react-tutorial.meteorapp.com.
Galaxy is building the app into a native image.
Waiting for deployment updates from Galaxy... 
Building app image...                         
Deploying app...                              
You have successfully deployed the first version of your app.
For details, visit https://galaxy.meteor.com/app/react-tutorial.meteorapp.com
```

This process usually takes around 5 minutes but it depends on your internet speed as it's going to send your app bundle to Galaxy servers. 

> Galaxy builds a new Docker image that contains your app bundle and then deploy containers using it, read [more](https://galaxy-guide.meteor.com/container-environment.html)

You can check your logs on Galaxy, including the part that Galaxy is building your Docker image and deploying it.

## 12.5: Access and enjoy

Now you should be able to access your Galaxy dashboard at `https://galaxy.meteor.com/app/react-tutorial.meteorapp.com` (replacing `react-tutorial` with your sub-domain)

And, of course, be able to access and use your app in the domain that you chose, in our case here [react-tutorial.meteorapp.com](http://react-tutorial.meteorapp.com). Congrats!

> We deployed to Galaxy running in the US (us-east-1), we also have Galaxy running in other regions in the world, check the list [here](https://galaxy-guide.meteor.com/deploy-region.html) 

This is huge, you have your Meteor app running on Galaxy, ready to be used by anyone in the world!

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step12) 

In the next step we are going to provide some ideas for you to continue developing your app and more content to see next.
