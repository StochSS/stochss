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
let domReady = require('domready');
let bootstrap = require('bootstrap');
//support files
let app = require('../app');
//models
let Model = require('../models/model');
//views
let PageView = require('./base');
let Rules = require('./rules-viewer');
let Events = require('./events-viewer');
let Species = require('./species-viewer');
let Reactions = require('./reactions-viewer');
let Parameters = require('./parameters-viewer');
let SBMLComponents = require('./sbml-component-editor');
//templates
let template = require('../templates/pages/modelPresentation.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let ModelPresentationPage = PageView.extend({
  template: template,
  initialize: function (attrs, arguments) {
    PageView.prototype.initialize.apply(this, arguments);
    console.log("TODO: get the path to the model from the url")
    // let urlParams = new URLSearchParams(window.location.search)
    // this.model = new Model({
    //   directory: urlParams.get("path"),
    //   for: "presentation"
    // });
    console.log("TODO: get model from file system using the app.getXHR function")
    // let self = this;
    // let queryStr = "?path=" + this.model.directory;
    // let endpoint = path.join();
    // app.getXHR(endpoint, {
    //   success: function (err, response, body) {
    //     self.model.set(body);
    //     self.renderSubviews();
    //   }
    // });
    console.log("TODO: generate the open link and store in this.open")
  },
  renderSubviews: function () {
    PageView.prototype.render.apply(this, arguments);
    this.renderSpeciesContainer();
    this.renderParametersContainer();
    this.renderReactionsContainer();
    this.renderEventsContainer();
    this.renderRulesContainer();
    this.renderSBMLComponents();
  },
  renderEventsContainer: function () {
    let events = new Events({
      collection: this.model.eventsCollection
    });
    app.registerRenderSubview(this, events, "model-events");
  },
  renderParametersContainer: function () {
    let parameters = new Parameters({
      collection: this.model.parameters
    });
    app.registerRenderSubview(this, parameters, "model-parameters");
  },
  renderReactionsContainer: function () {
    let reactions = new Reactions({
      collection: this.model.reactions
    });
    app.registerRenderSubview(this, reactions, "model-reactions");
  },
  renderRulesContainer: function () {
    let rules = new Rules({
      collection: this.model.rules
    });
    app.registerRenderSubview(this, rules, "model-rules");
  },
  renderSBMLComponents: function () {
    let sbmlComponents = new SBMLComponentsView({
      functionDefinitions: this.model.functionDefinitions,
      viewMode: true
    });
    app.registerRenderSubview(this, sbmlComponents, "model-sbml-components");
  },
  renderSpeciesContainer: function () {
    let species = new Species({
      collection: this.model.species
    });
    app.registerRenderSubview(this, species, "model-species");
  }
});

domReady(() => {
  let p = new ModelPresentationPage({
    el: document.body
  });
  p.render();
});
