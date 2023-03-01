/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

let PageView = require('./base');
let MainView = require('../views/main');
//var templates = require('../templates');
let template = require('../templates/pages/home.pug');
let domReady = require('domready');

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
