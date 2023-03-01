/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
//views
let PageView = require('./base');
//templates
let loadingTemplate = require('../templates/pages/loadingPage.pug');
let errorTemplate = require('../templates/pages/errorTemplate.pug');
let template = require('../templates/pages/notebookPresentation.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let NotebookPresentationPage = PageView.extend({
  template: loadingTemplate,
  initialize: function (attrs, options) {
  	PageView.prototype.initialize.apply(this, arguments);
  	let urlParams = new URLSearchParams(window.location.search);
    let owner = urlParams.get("owner");
    let file = urlParams.get("file");
    this.fileType = "Notebook";
    let queryStr = "?owner=" + owner + "&file=" + file;
    let endpoint = "api/notebook/load" + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.name = body.file.split('/').pop().split('.ipynb')[0];
        this.renderSubviews(false, body.html);
      },
      error: (err, response, body) => {
        this.logoPath = "/hub/static/stochss-logo.png";
        this.title = "404 PAGE NOT FOUND";
        this.errMsg = `This ${this.fileType} presentation was removed by the author and is no longer available.`;
        this.renderSubviews(true, null);
      }
    });
    let downloadStart = "/stochss/notebook/download_presentation";
    this.downloadLink = path.join(downloadStart, owner, file);
    this.openLink = `https://open.stochss.org?open=${window.location.protocol}//${window.location.hostname}${this.downloadLink}`;
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(this.queryByHook("loading-header")).html(`Loading ${this.fileType}`);
    $(this.queryByHook("loading-spinner")).css("display", "block");
    $(this.queryByHook("loading-target")).css("display", "none");
    let message = `This ${this.fileType} can be downloaded or opened in your own StochSS Live! account using the buttons at the bottom of the page.`;
    $(this.queryByHook("loading-message")).html(message);
  },
  renderSubviews: function (notFound, html) {
    this.template = notFound ? errorTemplate : template;
  	PageView.prototype.render.apply(this, arguments);
    if(!notFound){
      let iframe = document.getElementById('notebook');
      let iframedoc = iframe.document;
      if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
      }else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
      }
      if (iframedoc) {
        iframedoc.write(html);
        iframedoc.close();
      }
    }
  }
});

domReady(() => {
  let p = new NotebookPresentationPage({
    el: document.body
  });
  p.render();
});
