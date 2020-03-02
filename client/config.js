module.exports = env => {
  if (env === 'development') {
    return devConfig;
  }
  if (env === 'production') {
    return prodConfig;
  }
  else {
    console.error("Unable to load config, please set env to 'development' or 'production'");
  }
}

const devConfig = {
  routePrefix: '/stochss/',
  apiUrl: '/api/'
}
