// views
var PageView = require('./base');
// templates
var template = require('../templates/pages/quickstart.pug');

import initPage from './page.js';

let quickStart = PageView.extend({
  template: template
});

initPage(quickStart);
