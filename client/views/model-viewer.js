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

//support files
let app = require('../app');
//views
let View = require('ampersand-view');
let RulesViewer = require('./rules-editor');
let EventsViewer = require('./events-viewer');
let SpeciesViewer = require('./species-editor');
let ReactionsViewer = require('./reactions-editor');
let ParametersViewer = require('./parameters-editor');
let SBMLComponentsView = require('./sbml-component-editor');
//templates
let template = require('../templates/includes/modelViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-model]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderSpeciesView();
    this.renderParametersView();
    this.renderReactionsView();
    this.renderEventsView();
    this.renderRulesView();
    this.renderSBMLComponentsView();
  },
  renderEventsView: function () {
    let eventsViewer = new EventsViewer({
      collection: this.model.eventsCollection
    });
    app.registerRenderSubview(this, eventsViewer, "events-viewer-container");
  },
  renderParametersView: function () {
    let parametersViewer = new ParametersViewer({
      collection: this.model.parameters,
      readOnly: true
    });
    app.registerRenderSubview(this, parametersViewer, "parameters-viewer-container");
  },
  renderReactionsView: function () {
    let reactionsViewer = new ReactionsViewer({
      collection: this.model.reactions,
      readOnly: true
    });
    app.registerRenderSubview(this, reactionsViewer, "reactions-viewer-container");
  },
  renderRulesView: function () {
    let rulesViewer = new RulesViewer({
      collection: this.model.rules,
      readOnly: true
    });
    app.registerRenderSubview(this, rulesViewer, "rules-viewer-container");
  },
  renderSBMLComponentsView: function () {
    let sbmlComponentsView = new SBMLComponentsView({
      functionDefinitions: this.model.functionDefinitions,
      readOnly: true
    });
    app.registerRenderSubview(this, sbmlComponentsView, "sbml-components-viewer-container");
  },
  renderSpeciesView: function () {
    let speciesViewer = new SpeciesViewer({
      collection: this.model.species,
      spatial: this.model.is_spatial,
      defaultMode: this.model.defaultMode,
      readOnly: true
    });
    app.registerRenderSubview(this, speciesViewer, "species-viewer-container");
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  }
});
