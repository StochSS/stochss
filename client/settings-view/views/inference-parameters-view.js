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
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let UniformParameterView = require('./uniform-parameter-view');
//templates
let editUniformTemplate = require('../templates/editUniformParameters.pug');
let viewUniformTemplate = require('../templates/viewUniformParameters.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=add-mi-parameter]' : 'handleAddParameterClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.inferenceSettings;
    this.stochssModel = attrs.stochssModel;
    this.priorMethod = attrs.priorMethod;
    if(!this.readOnly) {
      this.collection.updateVariables(this.stochssModel.parameters);
    }
  },
  render: function () {
  	this.template = this.readOnly ? viewUniformTemplate : editUniformTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.readOnly) {
      this.collection.on("add remove", () => {
        let disable = this.collection.length >= this.stochssModel.parameters.length;
        $(this.queryByHook("add-mi-parameter")).prop("disabled", disable);
      }, this)
      this.renderEditInferenceParameter();
      this.toggleAddParameter();
      this.toggleParameterCollectionError();
    }else{
    	this.renderViewInferenceParameter();
    }
  },
  getParameter: function () {
    let parameters = this.collection.map((param) => { return param.paramID; });
    let target = this.stochssModel.parameters.filter((param) => {
      return !parameters.includes(param.compID);
    })[0];
    return target;
  },
  handleAddParameterClick: function (e) {
    let target = this.getParameter();
    this.collection.addInferenceParameter(target.compID, target.name);
    this.updateTargetOptions();
    this.toggleAddParameter();
    this.toggleParameterCollectionError();
  },
  renderEditInferenceParameter: function () {
    if(this.editInferenceParameter) {
      this.editInferenceParameter.remove();
    }
    let options = {"viewOptions": {
      parent: this,
      stochssParams: this.stochssModel.parameters
    }}
    var inferenceParameterView = UniformParameterView;
    this.editInferenceParameter = this.renderCollection(
      this.collection,
      inferenceParameterView,
      this.queryByHook("edit-mi-parameter-collection"),
      options
    );
  },
  renderViewInferenceParameter: function () {
    if(this.viewInferenceParameter) {
      this.viewInferenceParameter.remove();
    }
    let options = {"viewOptions": {
      parent: this, viewMode: true,
      stochssParams: this.stochssModel.parameters
    }}
    var inferenceParameterView = UniformParameterView;
    this.viewInferenceParameter = this.renderCollection(
      this.collection,
      inferenceParameterView,
      this.queryByHook("view-mi-parameter-collection"),
      options
    );
  },
  toggleAddParameter: function () {
    let disable = this.collection.length >= this.stochssModel.parameters.length;
    $(this.queryByHook("add-mi-parameter")).prop('disabled', disable);
  },
  toggleParameterCollectionError: function () {
    let errorMsg = $(this.queryByHook('mi-parameter-collection-error'));
    if(this.collection.length <= 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  updateTargetOptions: function () {
  	this.editInferenceParameter.views.forEach((view) => {
  		view.renderTargetSelectView();
  	});
  },
  updateViewer: function () {
  	this.parent.renderViewParameterSpace();
  }
});