var PageView = require('./base');
//var templates = require('../templates');
var template = require('../templates/pages/home.pug');

module.exports = PageView.extend({
  pageTitle: 'StochSS',
  template: template
});
