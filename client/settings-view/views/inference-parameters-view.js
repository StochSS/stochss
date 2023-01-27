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
// let ParameterView = require('./sweep-parameter-view');
//templates
let editTemplate = require('../templates/editUniformParameters.pug');
let viewTemplate = require('../templates/viewUniformParameters.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=add-mi-parameter]' : 'handleAddParameterClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.parameterSweepSettings;
    this.stochssModel = attrs.stochssModel;
    if(!this.readOnly) {
      this.collection.updateVariables(this.stochssModel.parameters);
    }
  },
  render: function () {
  	this.template = this.readOnly ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.readOnly) {
      this.collection.on("add remove", () => {
        let disable = this.collection.length >= this.stochssModel.parameters.length;
        $(this.queryByHook("add-mi-parameter")).prop("disabled", disable);
      }, this)
      // this.renderEditSweepParameters();
    }
    // this.renderViewSweepParameters();
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
    // this.renderViewSweepParameters();
  },
  // renderEditSweepParameters: function () {
  //   if(this.editSweepParameters) {
  //     this.editSweepParameters.remove();
  //   }
  //   let options = {"viewOptions": {
  //     parent: this,
  //     stochssParams: this.stochssModel.parameters
  //   }}
  //   this.editSweepParameters = this.renderCollection(
  //     this.model.parameters,
  //     ParameterView,
  //     this.queryByHook("ps-parameter-collection"),
  //     options
  //   );
  // },
  // renderViewSweepParameters: function () {
  //   if(this.viewSweepParameters) {
  //     this.viewSweepParameters.remove();
  //   }
  //   let options = {"viewOptions": {
  //     parent: this,
  //     stochssParams: this.stochssModel.parameters,
  //     viewMode: true
  //   }}
  //   this.viewSweepParameters = this.renderCollection(
  //     this.model.parameters,
  //     ParameterView,
  //     this.queryByHook("view-sweep-parameters"),
  //     options
  //   );
  // }
});