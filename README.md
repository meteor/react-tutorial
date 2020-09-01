## Meteor API Documentation - http://docs.meteor.com

This is a [hexo](https://hexo.io) static site used to generate the [Meteor API Docs](http://docs.meteor.com).

## Contributing

We'd love your contributions! Please send us Pull Requests or open issues on [github](https://github.com/meteor/docs). Also, read the [contribution guidelines](https://github.com/meteor/docs/blob/master/Contributing.md).

If you are making a larger contribution, you may need to run the site locally:

### Running locally

#### Submodules

This repo has two submodules, one the theme, the other full Meteor repository.

We have the Meteor repo to generate the `data.js` file (see below).

After cloning, or updating the repo, it makes sense to run

```
git submodule update --init
```

Generally you should not commit changes to the submodules, unless you know what you are doing.

#### Starting hexo

- Install [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js (yes, this is an hexo project and not Meteor, in Meteor you don't need to worry about Node.js versions at all)

  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
- Install Node.js 8.11.2:

  `nvm install 8.11.2`
  
- Install the project

  `npm install`

- Run it

  `npm start`
