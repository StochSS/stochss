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
//views
let PageView = require('./base');
//templates
let template = require('../templates/pages/notebookPresentation.pug');

import bootstrapStyles from '../styles/bootstrap.css';
import styles from '../styles/styles.css';
import fontawesomeStyles from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

let NotebookPresentationPage = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
  	PageView.prototype.initialize.apply(this, arguments);
  	let urlParams = new URLSearchParams(window.location.search);
    let owner = urlParams.get("owner");
    let file = urlParams.get("file");
    let self = this;
    let queryStr = "?owner=" + owner + "&file=" + file;
    let endpoint = "api/notebook/load" + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.name = body.file.split('/').pop().split('.ipynb')[0];
        self.renderSubviews(body.html);
      }
    });
    let downloadStart = "https://staging.stochss.org/stochss/notebook/download_presentation";
    this.downloadLink = path.join(downloadStart, owner, file);
    this.openLink = "open.stochss.org?open=" + this.downloadLink;
  },
  renderSubviews: function (html) {
  	PageView.prototype.render.apply(this, arguments);
    let iframe = document.getElementById('notebook');
    let iframedoc = iframe.document;
    if (iframe.contentDocument) {
      iframedoc = iframe.contentDocument;
    }else if (iframe.contentWindow) {
      iframedoc = iframe.contentWindow.document;
    }
    if (iframedoc) {
      iframedoc.write(html);
      iframe.height = iframedoc.body.scrollHeight;
      iframedoc.close();
    }
  }
});

domReady(() => {
  let p = new NotebookPresentationPage({
    el: document.body
  });
  p.render();
});
