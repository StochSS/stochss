var config = require('./config.js')(process.env.NODE_ENV);

module.exports = {

  config: config,

  // This is a helper for navigating around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url pathname for example: "/costello/settings"
};
