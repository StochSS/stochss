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
let EditLatticeView = require('./lattice-view');
//templates
let template = require('../templates/latticesView.pug');

module.exports = View.extend({
  template: template,
  events: {
  	'click [data-hook=collapse]' : 'changeCollapseButtonText',
  	'click [data-hook=cartesian-lattice]' : 'addLattice',
  	'click [data-hook=spherical-lattice]' : 'addLattice',
  	'click [data-hook=cylindrical-lattice]' : 'addLattice',
  	'click [data-hook=xml-mesh-lattice]' : 'addLattice',
  	'click [data-hook=meshio-lattice]' : 'addLattice',
  	'click [data-hook=stochss-lattice]' : 'addLattice'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainLattice;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('lattices-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('lattices-view-tab')).tab('show');
      $(this.queryByHook('edit-lattices')).removeClass('active');
      $(this.queryByHook('view-lattices')).addClass('active');
    }else{
      this.renderEditLatticesView();
      this.collection.on('update-inuse', this.updateInUse, this);
      this.collection.parent.trigger('update-lattice-deps');
    }
    this.renderViewLatticesView();
  },
  addLattice: function (e) {
  	let type = e.target.dataset.name;
  	let name = this.collection.addLattice(type);
    this.collection.parent.actions.trigger('update-lattice-options', {currName: name});
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  renderEditLatticesView: function ({key=null, attr=null}={}) {
    if(this.editLatticesView) {
      this.editLatticesView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editLatticesView = this.renderCollection(
      this.collection,
      EditLatticeView,
      this.queryByHook('edit-lattices-list'),
      options
    );
  },
  renderViewLatticesView: function ({key=null, attr=null}={}) {
    if(this.viewLatticesView) {
      this.viewLatticesView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewLatticesView = this.renderCollection(
      this.collection,
      EditLatticeView,
      this.queryByHook('view-lattices-list'),
      options
    );
  },
  updateInUse: function ({deps=null}={}) {
    if(deps === null) { return; }
    this.collection.forEach((lattice) => {
      lattice.inUse = deps.includes(lattice.name);
    });
  }
});