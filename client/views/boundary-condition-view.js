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
let modals = require('../modals');
//views
let View = require('ampersand-view');
//templates
let editTemplate = require('../templates/includes/editBoundaryCondition.pug');
let viewTemplate = require('../templates/includes/viewBoundaryCondition.pug');

module.exports = View.extend({
  events: {
  	'click [data-hook=expand]' : 'toggleExpressionView',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
  	'click [data-hook=remove]' : 'removeBoundaryCondition'
  },
  initialize: function (attrs, options) {
  	View.prototype.initialize.apply(this, arguments);
  	this.viewMode = attrs.viewMode ? attrs.viewMode : false
  },
  render: function (attrs, options) {
  	this.template = this.viewMode ? viewTemplate : editTemplate;
  	View.prototype.render.apply(this, arguments);
  	$(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  editAnnotation: function () {
    let self = this;
    let name = this.model.name;
    let annotation = this.model.annotation;
    if(document.querySelector('#boundaryConditionAnnotationModal')) {
      document.querySelector('#boundaryConditionAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("boundaryCondition", name, annotation)).modal();
    let okBtn = document.querySelector('#boundaryConditionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#boundaryConditionAnnotationModal #boundaryConditionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditBoundaryConditionView();
      self.parent.renderViewBoundaryConditionView();
      modal.modal('hide');
    });
  },
  removeBoundaryCondition: function () {
    this.model.collection.remove(this.model);
  },
  toggleExpressionView: function (e) {
  	if(e.target.textContent.startsWith("View")){
  		$(this.queryByHook("expand")).html("Hide Expression");
  		$(this.queryByHook("expression")).css("display", "block");
  	}else{
  		$(this.queryByHook("expand")).html("View Expression");
  		$(this.queryByHook("expression")).css("display", "none");
  	}
  }
});