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
let EditShapesView = require('./shape-view');
//templates
let template = require('../templates/shapesView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-shapes]' : 'changeCollapseButtonText',
    'click [data-hook=cartesian-lattice]' : 'addShape',
    'click [data-hook=spherical-lattice]' : 'addShape',
    'click [data-hook=cylindrical-lattice]' : 'addShape'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainGeometry;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('shapes-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('shapes-view-tab')).tab('show');
      $(this.queryByHook('edit-shapes')).removeClass('active');
      $(this.queryByHook('view-shapes')).addClass('active');
    }else{
      this.renderEditShapesView();
      this.collection.on("update-inuse", this.updateInUse, this);
      this.collection.parent.trigger('update-shape-deps');
    }
    this.renderViewShapesView();
  },
  addShape: function (e) {
    let type = e.target.dataset.name;
    let name = this.collection.addShape(type);
    this.collection.parent.actions.trigger('update-shape-options', {currName: name});
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditShapesView: function ({key=null, attr=null}={}) {
    if(this.editShapesView) {
      this.editShapesView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editShapesView = this.renderCollection(
      this.collection,
      EditShapesView,
      this.queryByHook('edit-shapes-list'),
      options
    );
  },
  renderViewShapesView: function ({key=null, attr=null}={}) {
    if(this.viewShapesView) {
      this.viewShapesView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewShapesView = this.renderCollection(
      this.collection,
      EditShapesView,
      this.queryByHook('view-shapes-list'),
      options
    );
  },
  updateInUse: function ({deps=null}={}) {
    if(deps === null) { return; }
    this.collection.forEach((shape) => {
      shape.inUse = deps.includes(shape.name);
    });
  }
});
