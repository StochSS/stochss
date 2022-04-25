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
let modals = require('../../modals');
//views
let View = require('ampersand-view');
//templates
let editTemplate = require('../templates/editFunctionDefinition.pug');
let viewTemplate = require('../templates/viewFunctionDefinition.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=remove]' : 'removeFunctionDefinition',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#functionDefinitionAnnotationModal')) {
      document.querySelector('#functionDefinitionAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("functionDefinition", name, annotation)).modal();
    let okBtn = document.querySelector('#functionDefinitionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#functionDefinitionAnnotationModal #functionDefinitionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditFunctionDefinitionView();
      modal.modal('hide');
    });
  },
  removeFunctionDefinition: function () {
    this.model.collection.remove(this.model);
  }
});