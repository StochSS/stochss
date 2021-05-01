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

var _ = require('underscore');
var $ = require('jquery');
//var setFavicon = require('favicon-setter');
let xhr = require("xhr");
var App = require('ampersand-app');
var localLinks = require('local-links');
var domify = require('domify');
var path = require('path');
// support files
let app = require("../app");
//views
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
//templates
var headTemplate = require('!pug-loader!../templates/head.pug');
var bodyTemplate = require('!pug-loader!../templates/body.pug');

let operationInfoModalHtml = (infoKey) => {
  let fileBrowserInfo = `
    <p>In StochSS we use custom file extensions for a number of files we work with.  Here is a list of our extentions with the files they are associated with:</p>
    <table style="margin-left: 2em;">
      <tr>
        <td width=200> StochSS Model </td>
        <td> .mdl </td>
      </tr>
      <tr>
        <td width=200> StochSS Spatial Model </td>
        <td> .smdl </td>
      </tr>
      <tr>
        <td width=200> SBML Model </td>
        <td> .sbml </td>
      </tr>
      <tr>
        <td width=200> Workflows </td>
        <td> .wkfl </td>
      </tr>
    </table>
    <br>
    <p>Other useful file extensions include the following:</p>
    <table style="margin-left: 2em;">
      <tr>
        <td width=200> Jupyter Notebook </td>
        <td> .ipynb </td>
      </tr>
    </table>
  `;
  let modelInfo = `
    Model Information
  `;
  let workflowInfo = `
    Workflow Information
  `;

  let infoList = {"File Browser":fileBrowserInfo, "Models":modelInfo, "Workflows":workflowInfo}
  
  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Working with ${infoKey} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${infoList[infoKey]} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

module.exports = View.extend({
  template: bodyTemplate,
  autoRender: true,
  initialize: function () {
      this.listenTo(App, 'page', this.handleNewPage);
  },
  events: {
    'click [data-hook=registration-link-button]' : 'handleRegistrationLinkClick',
    'click [data-hook=user-logs-collapse]' : 'collapseExpandLogs'
    //'click a[href]': 'handleLinkClick'
  },
  render: function () {

    document.head.appendChild(domify(headTemplate()));

    this.renderWithTemplate(this);
    
    this.pageContainer = this.queryByHook('page-container');

    this.pageSwitcher = new ViewSwitcher({
      el: this.pageContainer,
      show: function (newView, oldView) {
        document.title = _.result(newView, 'pageTitle') || 'StochSS';
        document.scrollTop = 0;
        
        App.currentPage = newView;
      }
    });

    var homePath = window.location.pathname.startsWith("/user") ? "/hub/stochss" : "stochss/home"
    $(this.queryByHook("home-link")).prop('href', homePath);
    let self = this;
    this.getUserLogs();
    this.scrolled = false;
    this.scrollCount = 0;
    $("#user-logs").on("mousewheel", function(e) {
      self.scrolled = true;
      self.scrollCount = 0;
    });
    return this;
  },
  collapseExpandLogs: function (e) {
    let logs = $("#user-logs");
    let classes = logs.attr("class").split(/\s+/);
    if(classes.includes("show")) {
      logs.removeClass("show");
      $(this.queryByHook(e.target.dataset.hook)).html("+");
      $(".user-logs").removeClass("expand-logs");
      $(".side-navbar").css("z-index", 0);
    }else{
      logs.addClass("show");
      $(this.queryByHook(e.target.dataset.hook)).html("-");
      if($(".sidebar-sticky").css("position") === "fixed") {
        $(".user-logs").addClass("expand-logs");
        $(".side-navbar").css("z-index", 1);
      }
    }
    // let element = document.querySelector("#user-logs");
    // element.scrollTop = element.scrollHeight;
  },
  getUserLogs: function () {
    let self = this;
    let endpoint = path.join(app.getApiPath(), "user-logs");
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400 && body) {
        let scrolled = self.scrolled;
        console.log(self.logs !== body)
        if(!self.logs || self.logs.split("<br>").length !== body.split("<br>").length) {
          console.log(self.logs, body)
          self.formatLogs(body);
          $("#user-logs").html(self.logs);
          self.scrolled = scrolled;
        }
        if(!self.scrolled){
          let element = document.querySelector("#user-logs");
          element.scrollTop = element.scrollHeight;
        }else if(self.scrollCount < 60) {
          self.scrollCount += 1;
        }else{
          self.scrolled = false;
          self.scrollCount = 0;
        }
      }else{
        self.logs = "";
      }
      self.updateUserLogs();
    });
  },
  formatLogs: function (logs) {
    let logList = logs.split("<br>").map(function (log) {
      var time = log.split('$ ')[0]
      let date = new Date(time);
      let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
      var stamp = months[date.getMonth()] + " ";
      stamp += date.getDate() + ", ";
      stamp += date.getFullYear() + "  ";
      let hours = date.getHours();
      stamp += (hours < 10 ? 0 + hours : hours) + ":";
      let minutes = date.getMinutes();
      stamp += (minutes < 10 ? '0' + minutes : minutes) + ":";
      let seconds = date.getSeconds();
      stamp += seconds < 10 ? '0' + seconds : seconds;
      return log.replace(time, stamp);
    });
    logs = logList.join("<br>")
    this.logs = logs;
  },
  handleNewPage: function (view) {
    this.pageSwitcher.set(view);
    //this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    var localPath = localLinks.pathname(e);

    if (localPath) {
      e.preventDefault();
      this.navigate(localPath);
    }
  },

  handleRegistrationLinkClick: function () {
    $(this.queryByHook("registration-form")).collapse('show');
    $(this.queryByHook("registration-link")).collapse();
  },

  navigate: function (page) {
    window.location = url;
  },
  updateUserLogs: function () {
    setTimeout(_.bind(this.getUserLogs, this), 1000);
  }
});
