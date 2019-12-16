let PageView = require('./base');
let MainView = require('../views/main');
//var templates = require('../templates');
let template = require('../templates/pages/home.pug');
let domReady = require('domready');

let $ = require('jquery');
let bootstrap = require('bootstrap');

let app = require('../app');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

export default function initPage (page) {
  domReady(() => {
    let mainView = new MainView({
      el: document.body
    });
    let p = new page({
      el: document.querySelector('[data-hook="page-container"]'),
    });
    p.render()
  })
}
