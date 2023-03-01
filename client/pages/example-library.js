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
let $ = require('jquery');
let path = require('path');
//support files
var app = require('../app');
//views
let PageView = require('./base');
//templates
let template = require('../templates/pages/exampleLibrary.pug');

import initPage from './page.js';

let exampleLibrary = PageView.extend({
  template: template,
  events: {
  	'click [data-hook=collapse-well-mixed]' : 'changeCollapseButtonText',
  	'click [data-hook=collapse-spatial]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
  	PageView.prototype.render.apply(this, arguments);
  	this.getExampleLibrary();
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e)
  },
  getExampleLibrary: function () {
    let endpoint = path.join(app.getApiPath(), "example-library");
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        $(this.queryByHook('well-mixed-examples')).html(body.wellMixed);
        $(this.queryByHook('spatial-examples')).html(body.spatial);
      }
    });
  }
});

initPage(exampleLibrary);
