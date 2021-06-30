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

var $ = require('jquery');
let _ = require('underscore');
//support files
let app = require('../app');
var tests = require('./tests');
var modals = require('../modals');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var editTemplate = require('../templates/includes/editRule.pug');
let viewTemplate = require('../templates/includes/viewRules.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=rule-type]' : 'selectRuleType',
    'change [data-hook=rule-variable]' : 'selectRuleVariable',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeRule',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.viewMode){
      this.model.on('change', _.bind(this.updateViewer, this))
    }
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
  update: function (e) {
  },
  updateValid: function () {
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#ruleAnnotationModal')) {
      document.querySelector('#ruleAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("rule", name, annotation)).modal();
    let okBtn = document.querySelector('#ruleAnnotationModal .ok-model-btn');
    let input = document.querySelector('#ruleAnnotationModal #ruleAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditRules();
      modal.modal('hide');
    });
  },
  getOptions: function () {
    var species = this.model.collection.parent.species;
    var parameters = this.model.collection.parent.parameters;
    var specs = species.map(function (specie) {
      return [specie.compID, specie.name];
    });
    var params = parameters.map(function (parameter) {
      return [parameter.compID, parameter.name];
    });
    let options = [{groupName: "Variables", options: specs},
                   {groupName: "Parameters", options: params}];
    return options;
  },
  selectRuleType: function (e) {
    this.model.type = e.target.value;
  },
  selectRuleVariable: function (e) {
    var species = this.model.collection.parent.species;
    var parameters = this.model.collection.parent.parameters;
    var compID = Number(e.target.value);
    var ruleVar = species.filter(function (specie) {
      if(specie.compID === compID) {
        return specie;
      }
    });
    if(!ruleVar.length) {
      ruleVar = parameters.filter(function (parameter) {
        if(parameter.compID === compID) {
          return parameter;
        }
      });
    }
    this.model.variable = ruleVar[0];
  },
  removeRule: function () {
    this.model.collection.removeRule(this.model);
  },
  updateViewer: function () {
    this.parent.renderViewRules();
  },
  subviews: {
    inputName: {
      hook: 'rule-name',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'rule-name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      }
    },
    selectType: {
      hook: 'rule-type',
      prepareView: function (el) {
        let options = ['Rate Rule', 'Assignment Rule'];
        return new SelectView({
          name: 'type',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.type,
        });
      }
    },
    selectTarget: {
      hook: 'rule-variable',
      prepareView: function(el) {
        let options = this.getOptions();
        return new SelectView({
          name: 'variable',
          required: true,
          idAttributes: 'cid',
          groupOptions: options,
          value: this.model.variable.compID,
        });
      }
    },
    inputRule: {
      hook: 'rule-expression',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'rule-expression',
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
          placeholder: "--No Formula Entered--"
        });
      }
    }
  }
});