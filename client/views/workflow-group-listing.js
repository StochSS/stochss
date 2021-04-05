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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
let WorkflowListing = require("./workflow-listing");
//templates
let template = require('../templates/includes/workflowGroupListing.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    let parentPath = path.dirname(this.model.model.directory);
    let queryString = "?path=" + this.model.model.directory + "&parentPath=" + parentPath;
    let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection') + queryString;
    $(this.queryByHook(this.model.elementID + "-workflow-btn")).prop("href", endpoint);
    this.renderWorkflowCollection();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderWorkflowCollection: function () {
    if(this.workflowCollectionView){
      this.workflowCollectionView.remove();
    }
    this.workflowCollectionView = this.renderCollection(
      this.model.workflows,
      WorkflowListing,
      this.queryByHook("workflow-listing")
    );
  }
});