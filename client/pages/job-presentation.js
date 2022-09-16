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
let path = require('path');
let domReady = require('domready');
let bootstrap = require('bootstrap');
//support files
let app = require("../app");
//models
let Job = require("../models/job");
//views
let PageView = require('./base');
let JobView = require('../job-view/job-view');
//templates
let template = require('../templates/pages/jobPresentation.pug');
let loadingTemplate = require('../templates/pages/loadingPage.pug');
let errorTemplate = require('../templates/pages/errorTemplate.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let JobPresentationPage = PageView.extend({
  template: loadingTemplate,
  initialize: function () {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    let owner = urlParams.get("owner");
    let file = urlParams.get("file");
    this.fileType = "Job"
    this.model = new Job({
      directory: file,
    });
    let endpoint = `api/job/load?file=${file}&owner=${owner}`;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.title = body.job.name;
        this.titleType = body.job.titleType;
        this.model.set(body.job);
        this.domainPlot = body.domainPlot ? body.domainPlot : null;
        this.renderSubviews(false);
      },
      error: (err, response, body) => {
        this.renderSubviews(true);
      }
    });
    let downloadStart = "/stochss/job/download_presentation";
    this.downloadLink = path.join(downloadStart, owner, file);
    this.openLink = `https://open.stochss.org?open=${window.location.protocol}//${window.location.hostname}${this.downloadLink}`;
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(this.queryByHook("loading-header")).html(`Loading ${this.fileType}`);
    $(this.queryByHook("loading-target")).css("display", "none");
    $(this.queryByHook("loading-spinner")).css("display", "block");
    let message = `This ${this.fileType} can be downloaded or opened in your own StochSS Live! account using the buttons at the bottom of the page.`;
    $(this.queryByHook("loading-message")).html(message);
  },
  renderSubviews: function (notFound) {
    this.template = notFound ? errorTemplate : template
    PageView.prototype.render.apply(this, arguments);
    if(!notFound) {
      this.renderJobView();
    }
  },
  renderJobView: function () {
    let jobView = new JobView({
      model: this.model,
      wkflName: this.title,
      titleType: this.titleType,
      domainPlot: this.domainPlot,
      newFormat: true,
      readOnly: true
    });
    app.registerRenderSubview(this, jobView, "job-view");
  }
});

domReady(() => {
  let p = new JobPresentationPage({
    el: document.body
  });
  p.render();
});
