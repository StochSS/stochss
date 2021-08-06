/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let app = require("../app");
//models
let Job = require("../models/job");
//views
let PageView = require('./base');
let ModelView = require('../model-view/model-view');
let ResultsView = require('../views/job-results-view');
let SettingsView = require('../views/settings-viewer');
//templates
let template = require('../templates/pages/jobPresentation.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let JobPresentationPage = PageView.extend({
  template: template,
  initialize: function () {
    PageView.prototype.initialize.apply(this, arguments);
    console.log("TODO: get the path to the job from the url")
    // let urlParams = new URLSearchParams(window.location.search)
    // this.model = new Job({
    //   directory: urlParams.get("path")
    // });
    console.log("TODO: get job from file system using the app.getXHR function")
    // let self = this;
    // let queryStr = "?path=" + this.model.directory;
    // let endpoint = path.join();
    // app.getXHR(endpoint, {
    //   success: function (err, response, body) {
    //     self.model.set(body);
    //     self.model.type = body.titleType;
    //     self.renderSubviews();
    //   }
    // });
    console.log("TODO: generate the open link and store in this.open")
  },
  renderSubviews: function () {
    PageView.prototype.render.apply(this, arguments);
    this.renderResultsContainer();
    this.renderSettingsContainer();
    this.renderModelContainer();
  },
  renderModelContainer: function () {
    let modelView = new ModelView({
      model: this.model.model,
    });
    app.registerRenderSubview(this, modelView, "job-model");
  },
  renderResultsContainer: function () {
    let resultsView = new ResultsView({
      model: this.model,
      mode: "presentation"
    });
    app.registerRenderSubview(this, resultsView, "job-results");
  },
  renderSettingsContainer: function () {
    let settingsView = new SettingsView({
      model: this.model.settings,
      mode: "presentation"
    });
    app.registerRenderSubview(this, settingsView, "job-settings");
  }
});

domReady(() => {
  let p = new JobPresentationPage({
    el: document.body
  });
  p.render();
});
