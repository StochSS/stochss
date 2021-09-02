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

let path = require('path');
//support files
let app = require('../app');
let Plotly = require('../lib/plotly');
//views
var PageView = require('../pages/base');
//templates
let template = require("../templates/pages/multiplePlots.pug");
let presTemplate = require("../templates/pages/multiplePlotsPresentation.pug");

import initPage from './page.js';

let ModelEditor = PageView.extend({
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    this.workflow = urlParams.get("wkfl");
    this.job = urlParams.get("job");
    this.path = urlParams.get("path");
    this.data = urlParams.get("data");
    this.template = this.path.includes("presentation_cache") ? presTemplate : template;
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    let queryStr = "?path=" + this.path + "&data=" + this.data;
    let endpoint = path.join(app.getApiPath(), "workflow/plot-results") + queryStr;
    let self = this;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.plotFigure(body);
      },
      error: function (err, response, body) {
        console.log(body)
      }
    });
  },
  plotFigure: function (figure) {
    let el = this.queryByHook("figures");
    let config = {"responsive":true};
    Plotly.newPlot(el, figure, config);
  }
});

initPage(ModelEditor);