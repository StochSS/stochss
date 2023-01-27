/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
//support files
let app = require('../../app');
//views
let View = require('ampersand-view');
let InferenceParametersView = require('./inference-parameters-view');
//templates
let template = require('../templates/inferenceSettingsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.stochssModel = attrs.stochssModel;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook(this.model.elementID + '-inference-settings-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook(this.model.elementID + '-inference-settings-view-tab')).tab('show');
      $(this.queryByHook(this.model.elementID + '-edit-inference-settings')).removeClass('active');
      $(this.queryByHook(this.model.elementID + '-view-inference-settings')).addClass('active');
    }else{
      this.renderEditParameterSpace();
    }
    this.renderViewParameterSpace();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditParameterSpace: function () {
    if(this.editParameterSpace) {
      this.editParameterSpace.remove();
    }
    this.editParameterSpace = new InferenceParametersView({
      collection: this.model.parameters,
      stochssModel: this.stochssModel
    });
    let hook = "edit-parameter-space-container";
    app.registerRenderSubview(this, this.editParameterSpace, hook);
  },
  renderViewParameterSpace: function () {
    if(this.viewParameterSpace) {
      this.viewParameterSpace.remove();
    }
    this.viewParameterSpace = new InferenceParametersView({
      collection: this.model.parameters,
      readOnly: true,
      stochssModel: this.stochssModel
    });
    let hook = "view-parameter-space-container";
    app.registerRenderSubview(this, this.viewParameterSpace, hook);
  }
});
