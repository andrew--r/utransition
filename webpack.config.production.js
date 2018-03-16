import webpack from 'webpack';
import WebpackConfig from 'webpack-config';

module.exports = new WebpackConfig()
	.extend('webpack.config.base.js')
	.merge({
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compressor: {
					screw_ie8: true,
					warnings: false,
				}
			}),
		],
	});
