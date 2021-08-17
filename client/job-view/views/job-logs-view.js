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
//support files
let app = require('../../app');
//views
let View = require('ampersand-view');
//tempates
let template = require('../templates/jobLogsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-info]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.listOfWarnings = [];
    this.listOfErrors = [];
    this.listOfNotes = [];
    let logs = attrs.logs.split("root - ");
    if(logs.length > 1){
      logs.shift();
    }
    logs.forEach(this.parseLogs, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.parent.model.status === "error") {
      $(this.queryByHook("job-info")).collapse("show");
      $(this.queryByHook("collapse-info")).html("-");
    }
    this.expandLogContainers();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  expandLogContainers: function () {
    if(this.listOfWarnings.length) {
      $(this.queryByHook('job-warnings')).collapse('show');
      let listOfWarnings = "<p>" + this.listOfWarnings.join('<br>') + "</p>";
      $(this.queryByHook('list-of-warnings')).html(listOfWarnings);
    }
    if(this.listOfErrors.length) {
      $(this.queryByHook('job-errors')).collapse('show');
      let listOfErrors = "<p>" + this.listOfErrors.join('<br>') + "</p>";
      $(this.queryByHook('list-of-errors')).html(listOfErrors);
    }
    if(this.listOfNotes.length) {
      $(this.queryByHook('job-statistics')).collapse('show');
      let listOfNotes = "<p>" + this.listOfNotes.join('<br>') + "</p>";
      $(this.queryByHook('list-of-notes')).html(listOfNotes);
    }
  },
  parseLogs: function (log) {
    var message = log.split('\n');
    if(message.length > 1) {
      message.pop();
    }
    message = message.join('<br>');
    if(message.startsWith("WARNING")){
      this.listOfWarnings.push(message.split("WARNING").pop());
    }else if(message.startsWith("ERROR")){
      this.listOfErrors.push(message.split("ERROR").pop());
    }else if(message.startsWith("CRITICAL")){
      this.listOfErrors.push(message.split("CRITICAL").pop());
    }else{
      this.listOfNotes.push(message);
    }
  }
});
