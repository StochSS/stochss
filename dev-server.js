const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('./webpack.dev.js');
const compiler = webpack(config);

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const jsonServerMiddlewares = jsonServer.defaults();

server.use('/api', jsonServerMiddlewares);
server.use('/api', router);

// Webpack server
server.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  lazy: false
}));

server.listen(3000, () => {
  console.log('Listening on port 3000...');
});

