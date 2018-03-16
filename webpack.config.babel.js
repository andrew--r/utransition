console.log(`Starting build in ${process.env.NODE_ENV} mode...`);

switch (process.env.NODE_ENV) {
  case 'production': {
	module.exports = require('./webpack.config.production.js');
    break;
  }
  default: {
	process.env.NODE_ENV = 'development';
    module.exports = require('./webpack.config.development.js');
  }
}
