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
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let EditFunctionDefinition = require('./function-definition-view');
//templates
let template = require('../templates/sbmlComponentsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-function-definitions]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.sbmlComponentsEditor
    this.functionDefinitions = attrs.functionDefinitions;
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('function-definitions-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('function-definitions-view-tab')).tab('show');
      $(this.queryByHook('edit-function-definitions')).removeClass('active');
      $(this.queryByHook('view-function-definitions')).addClass('active');
    }else {
      this.renderEditFunctionDefinitionView();
    }
    this.renderViewFunctionDefinitionView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditFunctionDefinitionView: function () {
    if(this.editFunctionDefinitionView){
      this.editFunctionDefinitionView.remove();
    }
    this.editFunctionDefinitionView = this.renderCollection(
      this.functionDefinitions,
      EditFunctionDefinition,
      this.queryByHook('edit-function-definition-list')
    );
    app.tooltipSetup();
  },
  renderViewFunctionDefinitionView: function () {
    if(this.viewFunctionDefinitionView) {
      this.viewFunctionDefinitionView.remove();
    }
    let options = {viewOptions: {viewMode: true}};
    this.containsMdlWithAnn = this.functionDefinitions.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("function-definition-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("function-definition-annotation-header")).css("display", "block");
    }
    this.viewFunctionDefinitionView = this.renderCollection(
      this.functionDefinitions,
      EditFunctionDefinition,
      this.queryByHook('view-function-definition-list'),
      options
    );
    app.tooltipSetup();
  }
});