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
let katex = require('katex');
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
let modals = require('../../modals');
//views
let InputView = require('../../views/input');
let View = require('ampersand-view');
//templates
let viewTemplate = require('../templates/viewReaction.pug');
let editTemplate = require('../templates/reactionListing.pug');

module.exports = View.extend({
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'input-name-container'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        katex.render(this.model.summary, this.queryByHook('summary'), {
          displayMode: true,
          output: 'html',
          maxSize: 5
        });
      },
      hook: 'summary'
    },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=select]'  : 'selectReaction',
    'click [data-hook=remove]'  : 'removeReaction'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode) {
      this.rate = this.model.reactionType === "custom-propensity" ? this.model.propensity : this.model.rate.name;
      this.types = [];
      let self = this;
      if(this.model.types) {
        this.model.types.forEach(function (index) {
          let type = self.model.collection.parent.domain.types.get(index, "typeID");
          self.types.push(type.name);
        });
      }
    }else{
      this.model.on('change', _.bind(this.updateViewer, this));
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add');
    }
  },
  editAnnotation: function () {
    if(document.querySelector('#reactionAnnotationModal')) {
      document.querySelector('#reactionAnnotationModal').remove();
    }
    let self = this;
    let name = this.model.name;
    let annotation = this.model.annotation;
    let modal = $(modals.annotationModalHtml("reaction", name, annotation)).modal();
    let okBtn = document.querySelector('#reactionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#reactionAnnotationModal #reactionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditReactionListingView();
      modal.modal('hide');
    });
  },
  removeReaction: function (e) {
    this.collection.removeReaction(this.model);
    this.parent.collection.trigger("change");
  },
  selectReaction: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewReactionView();
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
    }
  }
});