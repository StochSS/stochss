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
let EditGeometriesView = require('./geometry-view');
//templates
let template = require('../templates/geometriesView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=standard-geometry]' : 'addGeometry',
    'click [data-hook=combinatory-geometry]' : 'addGeometry'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainGeometry;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('geometries-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('geometries-view-tab')).tab('show');
      $(this.queryByHook('edit-geometries')).removeClass('active');
      $(this.queryByHook('view-geometries')).addClass('active');
    }else{
      this.renderEditGeometriesView();
    }
    this.renderViewGeometriesView();
  },
  addGeometry: function (e) {
    let type = e.target.dataset.name;
    this.collection.addGeometry(type);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditGeometriesView: function ({key=null, attr=null}={}) {
    if(this.editGeometriesView) {
      this.editGeometriesView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editGeometriesView = this.renderCollection(
      this.collection,
      EditGeometriesView,
      this.queryByHook('edit-geometries-list'),
      options
    );
  },
  renderViewGeometriesView: function ({key=null, attr=null}={}) {
    if(this.viewGeometriesView) {
      this.viewGeometriesView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewGeometriesView = this.renderCollection(
      this.collection,
      EditGeometriesView,
      this.queryByHook('view-geometries-list'),
      options
    );
  },
});