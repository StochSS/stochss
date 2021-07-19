/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
    template: template,
    events: {
      'click [data-hook=registration-link-button]' : 'handleRegistrationLinkClick'
    },
    render: function () {
      PageView.prototype.render.apply(this, arguments);
      //$(this.queryByHook('stochss-logo')).html(graphics['logo'])
    },
    handleRegistrationLinkClick: function () {
      $(this.queryByHook("registration-form")).collapse('show');
      $(this.queryByHook("registration-link")).collapse();
    },
});

domReady(() => {
  let p = new HomePage({
    el: document.body
  });
  p.render()
})
