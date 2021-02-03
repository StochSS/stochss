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

let path = require('path');
var xhr = require('xhr');
//support files
var app = require('../app');
//views
var PageView = require('../pages/base');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
//templates
var template = require('../templates/pages/domainEditor.pug');

import initPage from './page.js';

let DomainEditor = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    let urlParams = new URLSearchParams(window.location.search)
    let modelPath = urlParams.get("path")
    let newDomain = urlParams.has("new") ? true : false;
    var queryStr = "?path=" + modelPath
    if(newDomain) {
      queryStr += "&new=True"
    }else if(urlParams.has("domainPath")) {
      queryStr += "&domain_path=" + urlParams.get("domainPath")
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      console.log(body)
      self.plot = body.fig;
      self.domain = new Domain(body.domain);
      self.model = self.buildModel(body.model, modelPath)
      self.renderSubviews();
    });
  },
  buildModel: function (modelData, modelPath) {
    var model = new Model(modelData);
    model.for = "domain";
    model.isPreview = false;
    model.directory = modelPath;
    return model;
  },
  renderSubviews: function () {
    console.log("Model: ", this.model)
    console.log("Domain: ", this.domain)
    console.log("Domain Plot: ", this.plot)
  }
});

initPage(DomainEditor);

/*
Navigating to the domain editor page
------------------------------
- load the models domain
    queryStr = "?path=<<model path>>"
      ex. ?path=cylinder_demo3d.smdl
- load a domain from a file ie. .domn or .xml files
    queryStr = "?path=<<model path>>&domainPath=<<domain file path>>"
      ex. ?path=cylinder_demo3d.smdl&domainPath=3D_cylinder.domn    or
          ?path=cylinder_demo3d.smdl&domainPath=cylinder.xml
- load a new domain (domainPath will be ignored if passed)
    queryStr = "?path=<<model path>>&new"
      ex. ?path=cylinder_demo3d.smdl&domainPath=3D_cylinder.domn&new    or
          ?path=cylinder_demo3d.smdl&new

Loading the domain editor page
------------------------------
- load the models domain
    queryStr = "?path=<<model path>>"
- load a domain from a file ie. .domn or .xml files
    queryStr = "?path=<<model path>>&domain_path=<<domain file path>>"
- load a new domain (domainPath will be ignored if passed)
    queryStr = "?path=<<model path>>&new=True"
*/