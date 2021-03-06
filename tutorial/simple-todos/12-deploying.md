---
title: '12: Deploying'
---

Now your app is tested and ready to be published so anyone can use it.

The best place to run your Meteor app is [Galaxy](https://www.meteor.com/cloud). Galaxy offers free deploy. Cool, right?

> If you have any trouble on this step you should send an email to Galaxy support and they are going to help you, send your message to `support@meteor.com`. Try to explain in details what is the issue and you are going to receive help as soon as possible. Also make sure you include in the subject: `React Tutorial` so you know where are you coming from.

## 12.1: Create your account

Do you have a Meteor Cloud Account? No? Ok, let's fix it.

Go to [cloud.meteor.com](https://cloud.meteor.com?isSignUp=true). You are going to see a form like this:

<img width="500px" src="/simple-todos/assets/step12-sign-up.png"/>

Sign up with GitHub and proceed from there. It's just going to ask you an username and password, you will need those to deploy your app.

Done, your account is created. You can use this account to access [atmospherejs.com](https://atmospherejs.com/), [Forums](https://forums.meteor.com) and much more including Galaxy free deploy.

## 12.2: Deploy it

Now you are ready to deploy, make sure you run `meteor npm install` before deploying to make sure all your dependencies are installed.

You also need to choose a sub-domain to publish your app. We are going to use the main domain `meteorapp.com` that is free and included on any Galaxy plan.

In this example we are going to use `react-tutorial.meteorapp.com` but make sure you select a different one, otherwise you are going to receive an error saying it is already used.

> You can learn how to use custom domains on Galaxy [here](https://cloud-guide.meteor.com/custom-domains.html). Custom domains are available from starting in the Essentials plan. 

Run the deploy command:

```shell script
meteor deploy react-tutorial.meteorapp.com --free --mongo
```

Make sure you replace `react-tutorial` by a custom name that you want as sub-domain.

You are going to see a log like this:

```shell script
meteor deploy react-tutorial.meteorapp.com --free --mongo
Talking to Galaxy servers at https://us-east-1.galaxy-deploy.meteor.com
Preparing to build your app...                
Preparing to upload your app... 
Uploaded app bundle for new app at react-tutorial.meteorapp.com.
Galaxy is building the app into a native image.
Waiting for deployment updates from Galaxy... 
Building app image...                         
Deploying app...                              
You have successfully deployed the first version of your app.

*** Your MongoDB shared instance database URI will be here as well ***

For details, visit https://galaxy.meteor.com/app/react-tutorial.meteorapp.com
```

This process usually takes around 5 minutes but it depends on your internet speed as it's going to send your app bundle to Galaxy servers. 

> Galaxy builds a new Docker image that contains your app bundle and then deploy containers using it, read [more](https://cloud-guide.meteor.com/container-environment.html)

You can check your logs on Galaxy, including the part that Galaxy is building your Docker image and deploying it.

## 12.3: Access and enjoy

Now you should be able to access your Galaxy dashboard at `https://galaxy.meteor.com/app/react-tutorial.meteorapp.com` (replacing `react-tutorial` with your sub-domain)

And, of course, be able to access and use your app in the domain that you chose, in our case here [react-tutorial.meteorapp.com](http://react-tutorial.meteorapp.com). Congrats!

> We deployed to Galaxy running in the US (us-east-1), we also have Galaxy running in other regions in the world, check the list [here](https://cloud-guide.meteor.com/deploy-region.html) 

This is huge, you have your Meteor app running on Galaxy, ready to be used by anyone in the world!

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step12) 

In the next step we are going to provide some ideas for you to continue developing your app and more content to see next.
