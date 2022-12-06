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
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let EditActionView = require('./action-view');
//templates
let template = require('../templates/actionsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=fill-action]' : 'addAction',
    'click [data-hook=set-action]' : 'addAction',
    'click [data-hook=remove-action]' : 'addAction'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainAction;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('actions-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('actions-view-tab')).tab('show');
      $(this.queryByHook('edit-actions')).removeClass('active');
      $(this.queryByHook('view-actions')).addClass('active');
    }else{
      this.renderEditActionsView();
      this.collection.on('update-geometry-options', this.updateGeometryOptions, this);
      this.collection.on('update-lattice-options', this.updateLatticeOptions, this);
      this.collection.on('update-transformation-options', this.updateTransformationOptions, this);
    }
    this.renderViewActionsView();
  },
  addAction: function (e) {
    let type = e.target.dataset.name;
    this.collection.addAction(type);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditActionsView: function ({key=null, attr=null}={}) {
    if(this.editActionsView) {
      this.editActionsView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editActionsView = this.renderCollection(
      this.collection,
      EditActionView,
      this.queryByHook('edit-actions-list'),
      options
    );
  },
  renderViewActionsView: function ({key=null, attr=null}={}) {
    if(this.viewActionsView) {
      this.viewActionsView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewActionsView = this.renderCollection(
      this.collection,
      EditActionView,
      this.queryByHook('view-actions-list'),
      options
    );
  },
  updateGeometryOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    this.editActionsView.views.forEach((view) => {
      if(view.model.geometry === currName) {
        view.model.geometry = newName;
      }
      view.renderGeometrySelectView();
    });
  },
  updateLatticeOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    this.editActionsView.views.forEach((view) => {
      if(view.model.lattice === currName) {
        view.model.lattice = newName;
      }
      view.renderLatticeSelectView();
    });
  },
  updateTransformationOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    this.editActionsView.views.forEach((view) => {
      if(view.model.geometry === currName && newName !== null) {
        view.model.geometry = newName;
      }
      if(view.model.lattice === currName && newName !== null) {
        view.model.lattice = newName;
      }
      view.renderGeometrySelectView();
      view.renderLatticeSelectView();
    });
  }
});