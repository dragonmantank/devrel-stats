const path = require('path')
const webpack = require('webpack')
const nodeEnv = process.env.NODE_ENV || 'production'
require('dotenv').config();

const API_URL = process.env.API_URL;
const PORT = process.env.PORT;

module.exports = {
  entry: [
    './web.js'
  ],
  mode: nodeEnv,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, 'public/dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
  },
  plugins: [
    new webpack.DefinePlugin({
      "API_URL": JSON.stringify(API_URL),
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ]
}