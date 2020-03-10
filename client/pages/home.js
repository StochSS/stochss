let $ = require('jquery');
let PageView = require('./base');
let template = require('../templates/pages/home.pug');
let graphics = require('../graphics');

import initPage from './page.js';

let HomePage = PageView.extend({
    pageTitle: 'StochSS | Home',
    template: template,
    render: function () {
      PageView.prototype.render.apply(this, arguments);
      $(this.queryByHook('stochss-logo')).html(graphics['logo'])
    }
});

initPage(HomePage)
