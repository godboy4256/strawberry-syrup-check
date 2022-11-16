const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		main: "./src/index.tsx",
	},
	resolve: {
		modules: [path.join(__dirname, "node_modules")],
		extensions: [".tsx", ".ts", ".js", ".css", ".svg"],
	},
	output: {
		path: path.resolve(__dirname, "build/"),
		filename: "bundle.js",
		publicPath: "/",
		sourceMapFilename: "[name].js.map",
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				exclude: "/node_modules/",
				loader: "babel-loader",
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
				],
			},
			{
				test: /\.(ts|tsx)$/,
				use: [
					"babel-loader",
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "src/image/[name].[ext]?[hash]",
						},
					},
				],
			},
			{
				test: [/\.ts?$/, /\.tsx?$/],
				enforce: "pre",
				exclude: /node_modules/,
				use: ["source-map-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "index.html",
		}),
	],
	devServer: {
		host: "localhost",
		port: 3000,
		hot: true,
		open: true,
		client: {
			overlay: false,
		},
		historyApiFallback: true,
	},
};
