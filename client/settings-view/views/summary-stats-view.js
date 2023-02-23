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
//support files
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let CustomSummaryStatView = require('./custom-summary-stat-view');
let IdentitySummaryStatView = require('./identity-summary-stat-view');
//templates
let editCustomTemplate = require('../templates/editCustomSummaryStats.pug');
let viewCustomTemplate = require('../templates/viewCustomSummaryStats.pug');
let editMinimalTemplate = require('../templates/editMinimalSummaryStats.pug');
let viewMinimalTemplate = require('../templates/viewMinimalSummaryStats.pug');
let editIdentityTemplate = require('../templates/editIdentitySummaryStats.pug');
let viewIdentityTemplate = require('../templates/viewIdentitySummaryStats.pug');

module.exports = View.extend({
  events: {
    'change [data-target=minimal]' : 'updateMinimalFeatures',
    'click [data-hook=add-summary-stat]' : 'addSummaryStatistic'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.summaryStats;
    this.summariesType = attrs.summariesType;
  },
  render: function () {
  	if(this.summariesType === "identity") {
  		this.template = this.readOnly ? viewIdentityTemplate : editIdentityTemplate;
  	}else if(this.summariesType === "custom") {
  	  this.template = this.readOnly ? viewCustomTemplate : editCustomTemplate;
    }else if(this.summariesType === "minimal") {
      this.template = this.readOnly ? viewMinimalTemplate : editMinimalTemplate;
    }
    View.prototype.render.apply(this, arguments);
    if(!this.readOnly) {
      this.renderEditSummaryStat();
    }else{
    	this.renderViewSummaryStat();
    }
  },
  addSummaryStatistic: function ({name=""}={}) {
    if(this.summariesType === "identity") {
      this.collection.addSummaryStat();
    }else{
      this.collection.addSummaryStat({name: name});
    }
  },
  renderEditSummaryStat: function () {
    if(this.editSummaryStat) {
      this.editSummaryStat.remove();
    }
    if(this.summariesType === "minimal") {
      this.renderMinimalSummaryStats();
    }else{
      if(this.summariesType === "identity") {
        var summaryStatView = IdentitySummaryStatView;
      }else if(this.summariesType === "custom"){
        var summaryStatView = CustomSummaryStatView;
      }
      this.editSummaryStat = this.renderCollection(
        this.collection,
        summaryStatView,
        this.queryByHook("edit-summary-stat-collection"),
      );
    }
  },
  renderMinimalSummaryStats: function () {
    this.collection.forEach((summaryStat) => {
      let hook = `minimal-${summaryStat.name.replace('_', '-')}`;
      $(this.queryByHook(hook)).prop('checked', true);
    });
  },
  renderViewSummaryStat: function () {
    if(this.viewSummaryStat) {
      this.viewSummaryStat.remove();
    }
    if(this.summariesType === "minimal") {
      this.renderMinimalSummaryStats();
    }else{
      let options = {"viewOptions": { viewMode: true }};
      if(this.summariesType === "identity") {
        var summaryStatView = IdentitySummaryStatView;
      }else if(this.summariesType === "custom"){
        var summaryStatView = CustomSummaryStatView;
      }
      this.viewSummaryStat = this.renderCollection(
        this.collection,
        summaryStatView,
        this.queryByHook("view-summary-stat-collection"),
        options
      );
    }
  },
  updateMinimalFeatures: function (e) {
    let name = e.target.dataset.name;
    let model = this.collection.get(name, "name");
    if(e.target.checked && model === undefined) {
      this.collection.addSummaryStat({name: name});
    }else if(!(e.target.checked || model === undefined)){
      this.collection.removeSummaryStat(model);
    }
  },
  updateViewer: function () {
    this.parent.renderViewSummaryStats();
  }
});
