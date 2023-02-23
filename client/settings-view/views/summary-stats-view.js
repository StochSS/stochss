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
// let $ = require('jquery');
//support files
// let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let IdentitySummaryStatView = require('./identity-summary-stat-view');
//templates
let editIdentityTemplate = require('../templates/editIdentitySummaryStats.pug');
let viewIdentityTemplate = require('../templates/viewIdentitySummaryStats.pug');

module.exports = View.extend({
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.summariesType = attrs.summariesType;
    // if(!this.readOnly) {
    // }
  },
  render: function () {
  	// if(this.summariesType === "identity") {
  	// 	this.template = this.readOnly ? viewIdentityTemplate : editIdentityTemplate;
  	// }
  	this.template = this.readOnly ? viewIdentityTemplate : editIdentityTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.readOnly) {
      this.renderEditSummaryStat();
    }else{
    	this.renderViewSummaryStat();
    }
  },
  renderEditSummaryStat: function () {
    if(this.editSummaryStat) {
      this.editSummaryStat.remove();
    }
    // if(this.summariesType === "identity") {
    //  var summaryStatView = IdentitySummaryStatView;
    // }
    var summaryStatView = IdentitySummaryStatView;
    this.editSummaryStat = this.renderCollection(
      this.collection,
      summaryStatView,
      this.queryByHook("edit-summary-stat-collection"),
    );
  },
  renderViewSummaryStat: function () {
    if(this.viewSummaryStat) {
      this.viewSummaryStat.remove();
    }
    let options = {"viewOptions": { viewMode: true }};
    // if(this.summariesType === "identity") {
    //  var summaryStatView = IdentitySummaryStatView;
    // }
    var summaryStatView = IdentitySummaryStatView;
    this.viewSummaryStat = this.renderCollection(
      this.collection,
      summaryStatView,
      this.queryByHook("view-summary-stat-collection"),
      options
    );
  },
  updateViewer: function () {
    this.parent.renderViewSummaryStats();
  }
});
