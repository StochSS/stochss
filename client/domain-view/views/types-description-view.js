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
//support files
let app = require('../../app');
//views
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/typesDescriptionView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=file-select]' : 'selectTypeFile',
    'change [data-hook=file-location-select]' : 'selectFileLocation',
    'click [data-hook=set-particle-types-btn]' : 'getTypesFromFile'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.typeFile = null;
  },
  render: function(attrs, options) {
    View.prototype.render.apply(this, arguments);
    let endpoint = path.join(app.getApiPath(), 'spatial-model/types-list');
    app.getXHR(endpoint, {success: (err, response, body) => {
      this.typeFiles = body.files;
      this.fileLocations = body.paths;
      this.renderFileSelectView();
    }});
  },
  completeAction: function () {
    $(this.queryByHook('st-in-progress')).css('display', 'none');
    $(this.queryByHook('st-complete')).css('display', 'inline-block');
  },
  errorAction: function (action) {
    $(this.queryByHook('st-in-progress')).css('display', 'none');
    $(this.queryByHook('st-action-error')).text(action);
    $(this.queryByHook('st-error')).css('display', 'block');
  },
  getTypesFromFile: function () {
    this.startAction();
    let queryStr = `?path=${this.typeFile}`;
    let endpoint = path.join(app.getApiPath(), 'spatial-model/particle-types') + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.parent.setParticleTypes(body.names, body.types);
        this.completeAction();
      },
      error: (err, response, body) => {
        this.errorAction(body.Message);
      }
    });
  },
  renderFileLocationSelectView: function (options) {
    if(this.fileLocationSelectView) {
      this.fileLocationSelectView.remove();
    }
    this.fileLocationSelectView = new SelectView({
      name: 'type-locations',
      required: false,
      idAttributes: 'cid',
      options: options,
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.fileLocationSelectView, "file-location-select");
  },
  renderFileSelectView: function () {
    if(this.fileSelectView) {
      this.fileSelectView.remove();
    }
    this.fileSelectView = new SelectView({
      name: 'type-files',
      required: false,
      idAttributes: 'cid',
      options: this.typeFiles,
      unselectedText: "-- Select Type File --",
    });
    app.registerRenderSubview(this, this.fileSelectView, "file-select");
  },
  selectFileLocation: function (e) {
    let value = e.target.value;
    this.typeFile = value ? value : null;
    $(this.queryByHook("set-particle-types-btn")).prop("disabled", this.typeFile === null);
  },
  selectTypeFile: function (e) {
    let value = e.target.value;
    if(value) {
      if(this.fileLocations[value].length > 1) {
        $(this.queryByHook("type-location-message")).css('display', "block");
        $(this.queryByHook("file-location-container")).css("display", "inline-block");
        this.renderFileLocationSelectView(this.fileLocations[value]);
        this.typeFile = null;
      }else{
        $(this.queryByHook("type-location-message")).css('display', "none");
        $(this.queryByHook("file-location-container")).css("display", "none");
        this.typeFile = this.fileLocations[value][0];
      }
    }else{
      $(this.queryByHook("type-location-message")).css('display', "none");
      $(this.queryByHook("file-location-container")).css("display", "none");
      this.typeFile = null;
    }
    $(this.queryByHook("set-particle-types-btn")).prop("disabled", this.typeFile === null);
  },
  startAction: function () {
    $(this.queryByHook("st-complete")).css('display', 'none');
    $(this.queryByHook("st-error")).css('display', 'none');
    $(this.queryByHook("st-in-progress")).css("display", "inline-block");
  },
});