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
let $ = require('jquery');
//support files
let app = require('../app');
//models
let Workflow = require('../models/workflow');
//views
let PageView = require('./base');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/pages/workflowManager.pug');

import initPage from './page.js';

let WorkflowManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=model-file]' : 'handleModelSelect',
    'change [data-hook=model-location]' : 'handleLocationSelect',
    'click [data-hook=save-model]' : 'handleSaveWorkflow'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    this.model = new Workflow({
      directory: urlParams.get('path')
    });
    let self = this;
    this.model.fetch({
      success: function (model, response, options) {
        $("#page-title").text("Workflow: " + self.model.name);
        if(self.model.directory.includes('.proj')) {
          let index = self.model.directory.indexOf('.proj') + 5;
          self.projectPath = self.model.directory.slice(0, index);
          $(self.queryByHook('project-breadcrumb')).text(self.projectPath.split('/').pop().split('.proj')[0]);
          $(self.queryByHook('workflow-breadcrumb')).text(self.model.name);
          self.queryByHook("project-breadcrumb-links").style.display = "block";
          self.queryByHook("return-to-project-btn").style.display = "inline-block";
        }
        if(response.models){
          self.renderModelSelectView(response.models);
        }
        self.renderSubviews();
      }
    });
  },
  handleLocationSelect: function (e) {
    let value = e.srcElement.value;
    if(value) {
      this.model.model = value;
    }
  },
  handleModelSelect: function (e) {
    let value = e.srcElement.value;
    if(value) {
      if(this.models.paths[value].length == 1) {
        $("#model-location-info").css("display", "none");
        if(this.modelLocationSelectView) {
          this.modelLocationSelectView.remove();
        }
        this.model.model = this.models.paths[value][0];
      }else{
        $("#model-location-info").css("display", "block");
        this.renderModelLocationSelectView(value);
      }
    }
  },
  handleSaveWorkflow: function (e) {
    let self = this;
    let endpoint = this.model.url();
    xhr({uri: endpoint, json: true, method: 'post', data: this.model.toJSON()}, function (err, response, body) {
      if(response.statusCode < 400) {
        console.log(body)
        $(self.queryByHook("src-model")).css("display", "none");
      }
    });
  },
  renderModelLocationSelectView: function (model) {
    if(this.modelLocationSelectView) {
      this.modelLocationSelectView.remove();
    }
    this.modelLocationSelectView = new SelectView({
      label: 'Location: ',
      name: 'source-model-location',
      required: true,
      idAttributes: 'cid',
      options: this.models.paths[model],
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.modelLocationSelectView, "model-location");
  },
  renderModelSelectView: function (models) {
    this.models = models;
    $(this.queryByHook("src-model")).css("display", "block");
    let modelSelectView = new SelectView({
      label: 'Model: ',
      name: 'source-model',
      required: true,
      idAttributes: 'cid',
      options: models.files,
      unselectedText: "-- Select Model --"
    });
    app.registerRenderSubview(this, modelSelectView, "model-file");
  },
  renderSubviews: function () {
    console.log(this.model)
  }
});

initPage(WorkflowManager);