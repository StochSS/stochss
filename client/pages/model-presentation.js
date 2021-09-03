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
let app = require('../app');
//models
let Model = require('../models/model');
//views
let PageView = require('./base');
let ModelView = require('../model-view/model-view');
//templates
let template = require('../templates/pages/modelPresentation.pug');
let loadingTemplate = require('../templates/pages/loadingPage.pug');
let errorTemplate = require('../templates/pages/errorTemplate.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let ModelPresentationPage = PageView.extend({
  template: loadingTemplate,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    let owner = urlParams.get("owner");
    let file = urlParams.get("file");
    this.fileType = file.endsWith(".mdl") ? "Model" : "Spatial Model";
    this.model = new Model({
      directory: file,
      for: "presentation"
    });
    let self = this;
    let queryStr = "?file=" + this.model.directory + "&owner=" + owner;
    let endpoint = "api/file/json-data" + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.model.set(body.model);
        let domainPlot = Boolean(body.domainPlot) ? body.domainPlot : null;
        self.renderSubviews(false, domainPlot);
      },
      error: function (err, response, body) {
        self.notFound = true;
        self.renderSubviews(true);
      }
    });
    let downloadStart = "https://live.stochss.org/stochss/download_presentation";
    this.downloadLink = downloadStart + "/" + owner + "/" + file;
    this.openLink = "https://open.stochss.org?open=" + this.downloadLink;
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(this.queryByHook("loading-header")).html(`Loading ${this.fileType}`);
    $(this.queryByHook("loading-target")).css("display", "none");
    $(this.queryByHook("loading-spinner")).css("display", "block");
    let message = `This ${this.fileType} can be downloaded or opened in your own StochSS Live! account using the buttons at the bottom of the page.`;
    $(this.queryByHook("loading-message")).html(message);
  },
  renderSubviews: function (notFound, domainPlot) {
    this.template = notFound ? errorTemplate : template
    PageView.prototype.render.apply(this, arguments);
    if(!notFound) {
      this.renderModelView(domainPlot);
    }
  },
  renderModelView: function (domainPlot) {
    let modelView = new ModelView({
      model: this.model,
      readOnly: true,
      domainPlot: domainPlot
    });
    app.registerRenderSubview(this, modelView, "model-view");
  }
});

domReady(() => {
  let p = new ModelPresentationPage({
    el: document.body
  });
  p.render();
});
