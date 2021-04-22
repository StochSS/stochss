/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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

let xhr = require('xhr');
let path = require('path');
//support files
let app = require('../app');
//views
let InputView = require('./input');
let View = require('ampersand-view');
//templates
let gillespyResultsTemplate = require('../templates/includes/gillespyResults.pug');
let gillespyResultsEnsembleTemplate = require('../templates/includes/gillespyResultsEnsemble.pug');
let parameterSweepResultsTemplate = require('../templates/includes/parameterSweepResults.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'click [data-hook=collapse-results-btn]' : 'changeCollapseButtonText',
    'click [data-hook=convert-to-notebook]' : 'handleConvertToNotebookClick',
    'click [data-hook=download-results-csv]' : 'handleDownloadResultsCsvClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.plots = {};
    this.plotArgs = {};
  },
  render: function (attrs, options) {
    if(this.parent.model.type === "Parameter Sweep"){
      this.template = parameterSweepResultsTemplate;
    }else{
      this.template = this.model.settings.simulationSettings.realizations > 1 ? 
                                gillespyResultsEnsembleTemplate : gillespyResultsTemplate;
    }
    View.prototype.render.apply(this, arguments);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  handleConvertToNotebookClick: function (e) {
    let self = this;
    if(this.parent.model.type === "Ensemble Simulation") {
      var type = "gillespy";
    }else if(this.parent.model.type === "Parameter Sweep" && this.model.settings.parameterSweepSettings.parameters.length > 1) {
      var type = "2d_parameter_sweep";
    }else{
      var type = "1d_parameter-sweep";
    }
    let queryStr = "?path=" + this.model.directory + "&type=" + type;
    let endpoint = path.join(app.getApiPath(), "workflow/notebook") + queryStr;
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        console.log(body.FilePath);
        window.open(path.join(app.getBasePath(), "notebooks", body.FilePath));
      }
    });
  },
  handleDownloadResultsCsvClick: function (e) {
    let self = this;
    let queryStr = "?path=" + this.model.directory + "&action=resultscsv";
    var endpoint = path.join(app.getApiPath(), "file/download-zip") + queryStr;
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        window.open(path.join("files", body.Path));
      }
    });
  },
  setTitle: function (e) {
    this.plotArgs['title'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.title.text = e.target.value
      // this.plotFigure(fig, type)
    }
  },
  setXAxis: function (e) {
    this.plotArgs['xaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.xaxis.title.text = e.target.value
      // this.plotFigure(fig, type)
    }
  },
  setYAxis: function (e) {
    this.plotArgs['yaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.yaxis.title.text = e.target.value
      // this.plotFigure(fig, type)
    }
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    inputTitle: {
      hook: 'title',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'title',
          valueType: 'string',
          value: this.plotArgs.title || ""
        });
      }
    },
    inputXAxis: {
      hook: 'xaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xaxis',
          valueType: 'string',
          value: this.plotArgs.xaxis || ""
        });
      }
    },
    inputYAxis: {
      hook: 'yaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'yaxis',
          valueType: 'string',
          value: this.plotArgs.yaxis || ""
        });
      }
    }
  }
});
