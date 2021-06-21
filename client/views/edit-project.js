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
//support files
let app = require('../app');
let modals = require('../modals')
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/editProject.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove-project-btn]' : 'handleMoveToTrash'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  handleMoveToTrash: function (e) {
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let self = this;
    let modal = $(modals.moveToTrashConfirmHtml("model")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let queryStr = "?srcPath=" + self.model.directory + "&dstPath=" + path.join("trash", self.model.directory.split("/").pop());
      let endpoint = path.join(app.getApiPath(), "file/move") + queryStr
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          self.model.collection.remove(self.model);
        },
        error: function (err, response, body) {
          body = JSON.parse(body);
        }
      });
    });
  }
});