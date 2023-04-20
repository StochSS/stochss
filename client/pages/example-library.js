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
let errorTemplate = require('../templates/pages/errorTemplate.pug');
let loadingTemplate = require('../templates/pages/loadingPage.pug');

import initPage from './page.js';

let exampleLibrary = PageView.extend({
  template: loadingTemplate,
  events: {
  	'click [data-hook=collapse-well-mixed]' : 'changeCollapseButtonText',
  	'click [data-hook=collapse-spatial]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
  	PageView.prototype.render.apply(this, arguments);
    this.homeLink = "stochss/home";
    $(this.queryByHook("loading-header")).html(`Loading User Settings`);
    $(this.queryByHook("loading-target")).css("display", "none");
    $(this.queryByHook("loading-spinner")).css("display", "block");
    $(this.queryByHook("loading-message")).css("display", "none");
  	let endpoint = path.join(app.getLoadPath(), "example-library");
    app.getXHR(endpoint, {
      success: (err, response, body) => { this.renderContent(body); },
      error: (err, response, body) => { this.renderError(response, body); }
    });
  },
  renderContent: function (body) {
    this.template = template;
    PageView.prototype.render.apply(this, arguments);
    $(this.queryByHook('well-mixed-examples')).html(body.wellMixed);
    $(this.queryByHook('spatial-examples')).html(body.spatial);
  },
  renderError: function (response, body) {
    this.template = errorTemplate;
    this.logoPath = "/hub/static/stochss-logo.png";
    this.title = `${response.statusCode} ${body.reason}`;
    this.errMsg = body.message;
    PageView.prototype.render.apply(this, arguments);
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e)
  }
});

initPage(exampleLibrary);
