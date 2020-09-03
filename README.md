## Meteor React Tutorial

If you are looking for the tutorial, please go to [https://react-tutorial.meteor.com](https://react-tutorial.meteor.com) and check it there. 

This repository is the place to check the code (`src` folder) and to make contributions. 

Read in the tutorial home page where you should ask questions (spoiler: [Forums](https://forums.meteor.com) or [Slack](https://join.slack.com/t/meteor-community/shared_invite/enQtODA0NTU2Nzk5MTA3LWY5NGMxMWRjZDgzYWMyMTEyYTQ3MTcwZmU2YjM5MTY3MjJkZjQ0NWRjOGZlYmIxZjFlYTA5Mjg4OTk3ODRiOTc)).

This is a [hexo](https://hexo.io) static site used to generate the [Meteor React Tutorial Docs](https://react-tutorial.meteor.com).

## Contributing

We'd love your contributions! Please send us Pull Requests or open issues on [github](https://github.com/meteor/react-tutorial). Also, read the [contribution guidelines](https://github.com/meteor/docs/blob/master/Contributing.md).

If you are making a larger contribution, you may need to run the site locally:

### Running locally

- Install [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js (yes, this is an hexo project and not Meteor, in Meteor you don't need to worry about Node.js versions at all)

  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
- Install Node.js 8.11.2:

  `nvm install 8.11.2`
  
- Install the project

  `npm install`

- Run it

  `npm start`
  
### Making a Pull Request

- Create a fork and make your changes on it.

- Test your changes and make sure you sync your code changes (`src` folder) with your text changes (`tutorial` folder).

- Build your changes:

`npm run build`

- Create your Pull Request against `master` branch.

- Sign the CLA.

- Wait for feedback or approval.
