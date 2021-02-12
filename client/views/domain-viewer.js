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

var xhr = require('xhr');
var $ = require('jquery');
let path = require('path');
var _ = require('underscore');
//support files
var app = require('../app');
var Plotly = require('../lib/plotly');
var Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var TypesViewer = require('./view-domain-types');
var ParticleViewer = require('./view-particle');
//templates
var template = require('../templates/includes/domainViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.domainEditor;
    let self = this;
    this.model.particles.forEach(function (particle) {
      self.model.types.get(particle.type, "typeID").numParticles += 1;
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderTypesViewer();
    let self = this;
    let queryStr = "?path=" + this.parent.model.directory
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + queryStr;
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      self.plot = body.fig;
      self.displayDomain();
    });
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderParticleViewer: function (particle=null) {
    if(this.particleViewer) {
      this.particleViewer.remove();
    }
    if(particle){
      $(this.queryByHook("select-particle")).css("display", "none")
      this.particleViewer = new ParticleViewer({
        model: particle
      });
      this.registerRenderSubview(this.particleViewer, "particle-viewer")
    }
  },
  renderTypesViewer: function () {
    let typesViewer = this.renderCollection(
      this.model.types,
      TypesViewer,
      this.queryByHook("domain-types-list"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  },
  displayDomain: function () {
    let self = this;
    var el = this.queryByHook("domain-plot");
    Plotly.newPlot(el, this.plot);
    el.on('plotly_click', _.bind(this.selectParticle, this));
  },
  selectParticle: function (data) {
    let point = data.points[0];
    let particle = this.model.particles.get(point.id, "particle_id");
    this.renderParticleViewer(particle);
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
});