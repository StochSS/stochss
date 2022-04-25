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
let _ = require('underscore');
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/jobListing.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events['click [data-hook=' + this.model.elementID + '-open]'] = 'openActiveJob';
    events['click [data-hook=' + this.model.elementID + '-remove]'] = 'deleteJob';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.model.status === "running") {
      $(this.queryByHook(this.model.elementID + "-open")).prop("disabled", true);
      this.getJobStatus();
    }else{
      $(this.queryByHook(this.model.elementID + '-running-spinner')).css('display', "none")
    }
  },
  deleteJob: function (e) {
    let self = this;
    let endpoint = path.join(app.getApiPath(), "file/delete") + "?path=" + this.model.directory;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        let job = self.model.collection.remove(self.model);
        if(job.name === self.parent.model.activeJob.name){
          self.parent.model.activeJob.status = null;
          self.parent.updateWorkflow();
        }
        self.remove();
      }
    });
  },
  getJobStatus: function () {
    let self = this;
    let queryString = "?path=" + this.model.directory
    let endpoint = path.join(app.getApiPath(), "workflow/workflow-status") + queryString;
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        if(body === 'running') {
          setTimeout(_.bind(self.getJobStatus, self), 1000);
        }else{
          self.model.status = body;
          $(self.queryByHook(self.model.elementID + "-open")).prop("disabled", false);
          $(self.queryByHook(self.model.elementID + '-running-spinner')).css('display', "none");
          $(self.queryByHook(self.model.elementID + "-status")).text(body);
          self.parent.updateWorkflow();
        }
      }
    });
  },
  openActiveJob: function (e) {
    this.parent.setActiveJob(this.model);
  }
});
