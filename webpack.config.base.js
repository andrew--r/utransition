import path from 'path';
import webpack from 'webpack';
import packageJson from './package.json';

const SOURCE = './source';
const OUT = './build';

module.exports = {
	entry: `${SOURCE}/index.js`,
	output: {
		path: path.resolve(__dirname, OUT),
		filename: `utransition-${packageJson.version}.js`,
		libraryTarget: 'umd',
		libraryName: 'utransition',
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				exclude: /(node_modules)/,
				loader: 'babel',
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
	],
};
