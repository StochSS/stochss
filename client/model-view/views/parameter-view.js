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
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
let modals = require('../../modals');
//views
let InputView = require('../../views/input');
let View = require('ampersand-view');
//templates
let editTemplate = require('../templates/editParameter.pug');
let viewTemplate = require('../templates/viewParameter.pug');

module.exports = View.extend({
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled'
    }
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeParameter',
    'change [data-hook=input-name-container]' : 'setParameterName'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.previousName = this.model.name;
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(!this.viewMode){
      this.model.on('change', _.bind(this.updateViewer, this));
    }
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add');
    }
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#parameterAnnotationModal')) {
      document.querySelector('#parameterAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("parameter", name, annotation)).modal();
    let okBtn = document.querySelector('#parameterAnnotationModal .ok-model-btn');
    let input = document.querySelector('#parameterAnnotationModal #parameterAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditParameter();
      modal.modal('hide');
    });
  },
  removeParameter: function () {
    this.remove();
    this.collection.removeParameter(this.model);
  },
  setParameterName: function (e) {
    if(!e.target.value.trim()) {
      this.model.name = this.previousName;
      this.parent.renderEditParameter();
    }else{
      this.previousName = this.model.name
      this.model.collection.trigger('update-parameters', this.model.compID, this.model);
      this.model.collection.trigger('remove');
    }
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewParameter();
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      }
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'expression',
          tests: tests.valueTests,
          modelKey: 'expression',
          valueType: 'number',
          value: this.model.expression
        });
      }
    }
  }
});