let $ = require('jquery');
let PageView = require('./base');
let graphics = require('../graphics');
let domReady = require('domready');
let bootstrap = require('bootstrap');
let template = require('../templates/pages/home.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let HomePage = PageView.extend({
    pageTitle: 'StochSS | Home',
    template: template,
    render: function () {
      PageView.prototype.render.apply(this, arguments);
      $(this.queryByHook('stochss-logo')).html(graphics['logo'])
    }
});

domReady(() => {
  let p = new HomePage({
    el: document.body
  });
  p.render()
})
