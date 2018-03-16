import webpack from 'webpack';
import WebpackConfig from 'webpack-config';
import WebpackDashboardPlugin from 'webpack-dashboard/plugin';

module.exports = new WebpackConfig()
	.extend('webpack.config.base.js')
	.merge({
		devtool: 'source-map',
		plugins: [
			new WebpackDashboardPlugin(),
		],
	});
