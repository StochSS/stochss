/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
//support files
let app = require('../../app');
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let RuleView = require('./rule-view');
let InputView = require('../../views/input');
//templates
let template = require('../templates/rulesView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=rate-rule]' : 'addRule',
    'click [data-hook=assignment-rule]' : 'addRule',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'change [data-hook=rule-filter]' : 'filterRules'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.collection.parent.species.on('add remove', this.toggleAddRuleButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddRuleButton, this);
    this.tooltips = Tooltips.rulesEditor;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderDocs();
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
      this.renderEditRules({'key': this.filterKey, 'attr': this.filterAttr});
      this.toggleAddRuleButton();
    }
    this.renderViewRules({'key': this.filterKey, 'attr': this.filterAttr});
  },
  addRule: function (e) {
    let type = e.target.dataset.name;
    this.collection.addRule(type);
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  filterRules: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditRules({'key': key, 'attr': attr});
    }
    this.renderViewRules({'key': key, 'attr': attr});
  },
  openSection: function () {
    if(!$(this.queryByHook("rules-list-container")).hasClass("show")) {
      let ruleCollapseBtn = $(this.queryByHook("collapse"));
      ruleCollapseBtn.click();
      ruleCollapseBtn.html('-');
    }
    if(!this.readOnly) {
      app.switchToEditTab(this, "rules");
    }
  },
  renderDocs: function () {
    let options = {
      displayMode: true,
      output: 'html',
      maxSize: 5
    };
    katex.render("dx/dt = f(W)", this.queryByHook("rr-doc-func"), options);
    katex.render("x = f(V)", this.queryByHook("ar-doc-func"), options);
  },
  renderEditRules: function ({key=null, attr=null}={}) {
    if(this.rulesView) {
      this.rulesView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.rulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('edit-rule-list-container'),
      options
    );
    app.tooltipSetup();
  },
  renderViewRules: function ({key=null, attr=null}={}) {
    if(this.viewRulesView) {
      this.viewRulesView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("rules-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("rules-annotation-header")).css("display", "block");
    }
    let options = {
      viewOptions: {viewMode: true, hasAnnotations: this.containsMdlWithAnn},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewRulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('view-rules-list-container'),
      options
    );
    app.tooltipSetup();
  },
  toggleAddRuleButton: function () {
    this.renderEditRules({'key': this.filterKey, 'attr': this.filterAttr});
    let numSpecies = this.collection.parent.species.length;
    let numParameters = this.collection.parent.parameters.length;
    let disabled = numSpecies <= 0 && numParameters <= 0;
    $(this.queryByHook('add-rule')).prop('disabled', disabled);
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'rule-filter',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'filter',
          valueType: 'string',
          disabled: this.filterKey !== null,
          placeholder: 'filter'
        });
      }
    }
  }
});