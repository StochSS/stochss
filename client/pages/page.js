let PageView = require('./base');
let MainView = require('../views/main');
//var templates = require('../templates');
let template = require('../templates/pages/home.pug');
let domReady = require('domready');

import styles from '../styles/styles.css';
import bootstrapStyles from '../styles/bootstrap.css';

let mainView = new MainView({
  el: document.body 
});

export default function initPage (page) {
  domReady(() => {
    let mainView = new MainView({
      el: document.body
    });
    let p = new page({
      el: '[data-hook="page-container"]'
    });
  })
}
