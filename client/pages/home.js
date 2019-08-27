let PageView = require('./base');
let template = require('../templates/pages/home.pug');

import initPage from './page.js';

let HomePage = PageView.extend({
    pageTitle: 'StochSS | Home',
    template: template
});

initPage(HomePage)
