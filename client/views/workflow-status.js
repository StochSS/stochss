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
let _ = require('underscore');
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/workflowStatus.pug');


module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.model.status !== 'running') {
      $(this.queryByHook('running-spinner')).css('display', "none");
    }else{
      this.getJobStatus();
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getJobStatus: function () {
    let self = this;
    let queryString = "?path=" + this.model.directory;
    let endpoint = path.join(app.getApiPath(), "workflow/workflow-status") + queryString;
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        if(body === 'running') {
          setTimeout(_.bind(self.getJobStatus, self), 1000);
        }else{
          self.parent.updateWorkflow();
        }
      }
    });
  }
});
