# JS library boilerplate

* [webpack](https://webpack.github.io/) for bundling
* [babel](https://babeljs.io/) for using latest language features
* [eslint](http://eslint.org/) with a bit modified [airbnb config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) for consistent code
* [mocha](https://mochajs.org/) for testing

## How to use it

First of all:

```bash
$ npm i -g yarn # install yarn globally if it's not installed yet
$ yarn # install dependencies
```

Run webpack in watch mode:

```
$ yarn start
```

Build for production:

```
$ yarn build
```

Lint source:

```
$ yarn lint
```

Run tests:

```
$ yarn test
```
