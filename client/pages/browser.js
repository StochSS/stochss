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
//support files
let app = require('../app');
let modals = require('../modals');
//collections
let Collection = require('ampersand-collection'); // form presentation browser
//model
let Project = require('../models/project'); // from project browser
let Presentation = require('../models/presentation'); // form presentation browser
//views
let PageView = require('./base');
let EditProjectView = require('../views/edit-project'); // from project browser
let PresentationView = require('../views/presentation-view'); // form presentation browser
let JSTreeView = require('../views/jstree-view');
//templates
let template = require('../templates/pages/browser.pug');

import initPage from './page.js';

let FileBrowser = PageView.extend({
  pageTitle: 'StochSS | File Browser',
  template: template,
  events: {
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('file-browser')).modal();
    },
    'click [data-hook=collapse-projects]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-presentations]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-files]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    var self = this
    // start block from project browser
    var endpoint = path.join(app.getApiPath(), "project/load-browser");
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.renderProjectsView(body.projects);
      }
    });
    // End block from project browser
    // Start block from presentation bowser
    var endpoint = path.join(app.getApiPath(), "file/presentations")
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.renderPresentationView(body.presentations);
      }
    });
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments)
    let jstreeView = new JSTreeView({
      configKey: "file"
    });
    app.registerRenderSubview(this, jstreeView, "jstree-view-container");
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
  },
  // Function from project browser
  renderProjectsView: function (projects) {
    let options = {model: Project, comparator: 'parentDir'};
    let projectCollection = new Collection(projects, options);
    this.renderCollection(
      projectCollection,
      EditProjectView,
      this.queryByHook("projects-view-container")
    );
  },
  // Function from presentation browser
  renderPresentationView: function (presentations) {
    let options = {model: Presentation};
    let presentCollection = new Collection(presentations, options);
    this.renderCollection(
      presentCollection,
      PresentationView,
      this.queryByHook("presentation-list")
    );
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  }
});

initPage(FileBrowser);
