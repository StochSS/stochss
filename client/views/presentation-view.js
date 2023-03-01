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
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/presentationView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=copy-link]' : 'copyLink',
    'click [data-hook=remove]' : 'removePresentation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function ( attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  copyLink: function (e) {
    let onFulfilled = (value) => {
      $(this.queryByHook("copy-link-success")).css("display", "inline-block");
      setTimeout(() => {
        $(this.queryByHook("copy-link-success")).css("display", "none");
      }, 5000);
    };
    let onReject = (reason) => {
      let msg = $(this.queryByHook("copy-link-failed"));
      msg.html(reason);
      msg.css("display", "inline-block");
    };
    app.copyToClipboard(this.model.link, onFulfilled, onReject);
  },
  removePresentation: function (e) {
    let self = this;
    let filePath = path.join('.presentations', this.model.file);
    let endpoint = path.join(app.getApiPath(), "file/delete") + "?path=" + filePath;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.model.collection.remove(self.model);
      }
    });
  }
});