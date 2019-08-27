let PageView = require('./base');
var template = require('../templates/pages/modelBrowser.pug');

import initPage from './page.js';

let ModelBrowser = PageView.extend({
    pageTitle: 'StochSS | Model Browser',
    template: template
});

initPage(ModelBrowser)
