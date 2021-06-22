/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
//support files
let app = require('../app');
var Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var RuleView = require('./edit-rule');
//templates
var template = require('../templates/includes/ruleEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=rate-rule]' : 'addRule',
    'click [data-hook=assignment-rule]' : 'addRule',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.collection.parent.species.on('add remove', this.toggleAddRuleButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddRuleButton, this);
    this.tooltips = Tooltips.rulesEditor
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('rules-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('rules-view-tab')).tab('show');
      $(this.queryByHook('edit-rules')).removeClass('active');
      $(this.queryByHook('view-rules')).addClass('active');
    }else {
      this.renderEditRules();
      this.toggleAddRuleButton();
    }
    this.renderViewRules();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderEditRules: function () {
    if(this.rulesView) {
      this.rulesView.remove();
    }
    this.rulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('edit-rule-list-container')
    );
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderViewRules: function () {
    if(this.viewRulesView) {
      this.viewRulesView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("rules-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("rules-annotation-header")).css("display", "block");
    }
    let options = {viewOptions: {viewMode: true}};
    this.viewRulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('view-rules-list-container'),
      options
    );
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddRuleButton: function () {
    // this.renderEditRules();
    var numSpecies = this.collection.parent.species.length;
    var numParameters = this.collection.parent.parameters.length;
    var disabled = numSpecies <= 0 && numParameters <= 0
    $(this.queryByHook('add-rule')).prop('disabled', disabled);
  },
  addRule: function (e) {
    var type = e.target.dataset.name
    this.collection.addRule(type);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
});