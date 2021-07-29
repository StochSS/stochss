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
//support files
let app = require('../app');
let Tooltips = require('../tooltips');
//models
let Model = require('../models/model');
//views
let View = require('ampersand-view');
let ParameterView = require('./sweep-parameter');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/includes/parameterSettings.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=variable-of-interest-list]' : 'setVariableOfInterest',
    'click [data-hook=collapse]' :  'changeCollapseButtonText',
    'click [data-hook=add-ps-parameter]' : 'handleAddParameterClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.parameterSweepSettings;
    if(this.readOnly) {
      this.renderSubviews();
    }else{
      this.stochssModel = new Model({
        directory: attrs.modelDirectory
      });
      let self = this;
      app.getXHR(this.stochssModel.url(), {
        success: function (err, response, body) {
          self.stochssModel.set(body)
          self.renderSubviews();
        }
      });
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getParameter: function () {
    let parameters = this.model.parameters.map(function (param) { return param.paramID });
    let target = this.stochssModel.parameters.filter(function (param) {
      return !parameters.includes(param.compID);
    })[0];
    return target;
  },
  handleAddParameterClick: function (e) {
    let target = this.getParameter();
    this.model.parameters.addSweepParameter(target.compID, target.name);
    this.renderViewSweepParameters();
  },
  renderEditSweepParameters: function () {
    if(this.editSweepParameters) {
      this.editSweepParameters.remove();
    }
    let options = {"viewOptions": {
      parent: this,
      stochssParams: this.stochssModel.parameters
    }}
    this.editSweepParameters = this.renderCollection(
      this.model.parameters,
      ParameterView,
      this.queryByHook("ps-parameter-collection"),
      options
    );
  },
  renderViewSweepParameters: function () {
    if(this.viewSweepParameters) {
      this.viewSweepParameters.remove();
    }
    let options = {"viewOptions": {
      parent: this,
      stochssParams: this.stochssModel.parameters,
      viewMode: true
    }}
    this.viewSweepParameters = this.renderCollection(
      this.model.parameters,
      ParameterView,
      this.queryByHook("view-sweep-parameters"),
      options
    );
  },
  renderSpeciesOfInterestView: function () {
    let options = this.stochssModel.species.map(function (specie) {
      return [specie.compID, specie.name];
    });
    let soi = this.model.speciesOfInterest.compID;
    let speciesOfInterestView = new SelectView({
      name: 'species-of-interest',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: options,
      value: soi
    });
    app.registerRenderSubview(this, speciesOfInterestView, "variable-of-interest-list");
  },
  renderSubviews: function () {
    if(!this.readOnly) {
      if(!Boolean(this.model.speciesOfInterest.name)) {
        this.model.speciesOfInterest = this.stochssModel.species.at(0);
      }
      this.model.updateVariables(this.stochssModel.parameters);
    }
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('parameter-settings-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('parameter-settings-view-tab')).tab('show');
      $(this.queryByHook('edit-parameter-settings')).removeClass('active');
      $(this.queryByHook('view-parameter-settings')).addClass('active');
    }else{
      this.model.parameters.on("add remove", function () {
        let disable = this.model.parameters.length >= 6 || this.model.parameters.length >= this.stochssModel.parameters.length
        $(this.queryByHook("add-ps-parameter")).prop("disabled", disable)
      }, this)
      this.renderSpeciesOfInterestView();
      this.renderEditSweepParameters();
    }
    this.renderViewSweepParameters()
  },
  setVariableOfInterest: function (e) {
    let target = e.target.value;
    let variable = this.stochssModel.species.filter(function (specie) {
      return specie.compID === Number(target);
    })[0];
    this.model.speciesOfInterest = variable;
    $("#view-species-of-interest").html(variable.name)
  }
});