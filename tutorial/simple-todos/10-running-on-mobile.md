---
title: "10: Running on Mobile"
---

Currently, Meteor on Windows does not support mobile builds. If you are using Meteor on Windows, you should skip this step.

So far, we've been building our app and testing only in a web browser, but Meteor has been designed to work across different platforms - your simple todo list website can become an iOS or Android app in just a few commands.

Meteor makes it easy to set up all the tools required to build mobile apps, but downloading all the programs can take a while - for Android the download is about 300MB and for iOS you need to install Xcode which is about 2GB. If you don't want to wait to download these tools, feel free to skip to the next step.

> Important: Mobile set up and settings are very dynamic, if you find any step below not working as specified or any linked document that is not up-to-date, please open an issue, and we are going to update it. You can also open PRs if you know what the change should be. 

## 10.1: iOS Simulator

If you have a Mac, you can run your app inside the iOS simulator.

Follow this [guide](https://guide.meteor.com/cordova.html#installing-prerequisites-ios) to install all the development prerequisites for iOS. 

When you're done, type:

```
meteor add-platform ios
meteor run ios
```

You will see the iOS simulator pop up with your app running inside.

<img width="300px" src="/simple-todos/assets/step10-ios-simulator.png"/>

## 10.2: Android Emulator

Follow this [guide](https://guide.meteor.com/cordova.html#installing-prerequisites-android) to install all the development prerequisites for Android.

When you are done installing everything, type:

```
meteor add-platform android
```

After you agree to the license terms, type:

```
metoer run android
```

After some initialization, you will see an Android emulator pop up, running your app inside a native Android wrapper. The emulator can be somewhat slow, so if you want to see what it's really like using your app, you should run it on an actual device.

<img width="300px" src="/simple-todos/assets/step10-android-emulator.png"/>

## 10.3: Android Device

First, complete all the steps above to set up the Android tools on your system. Then, make sure you have [USB Debugging](http://developer.android.com/tools/device.html#developer-device-options) enabled on your phone and it is plugged into your computer with a USB cable. Also, you must quit the Android emulator before running on a device.

Then, run the following command:

```
meteor run android-device
```

The app will be built and installed on your device.

## 10.4: iPhone or iPad

> This requires an Apple developer account.

If you have an Apple developer account, you can also run your app on an iOS device. Run the following command:

```
meteor run ios-device
```

This will open Xcode with a project for your iOS app. You can use Xcode to then launch the app on any device or simulator that Xcode supports.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/react-tutorial/tree/master/src/simple-todos/step10) 

In the next step we are going to add automatic tests.
