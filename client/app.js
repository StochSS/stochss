//var config = require('./config.js')(process.env.NODE_ENV);
let path = require('path');

let routePrefix = 'stochss';
let apiPrefix =  path.join(routePrefix, 'api');
let getBasePath = () => {
  try {
    let base = document.querySelector('base')
    let href = base.getAttribute('href')
    return href
  } catch (error) {
    return '/'
  }
};
let getApiPath = () => path.join(getBasePath(), apiPrefix);

module.exports = {
    routePrefix: routePrefix,
    getApiPath: getApiPath,
    getBasePath: getBasePath
};
