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

var _ = require('underscore');
var $ = require('jquery');
//var setFavicon = require('favicon-setter');
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

String.prototype.toHtmlEntities = function() {
  return this.replace(/./gm, function(s) {
    return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
  });
};

module.exports = View.extend({
  template: bodyTemplate,
  autoRender: true,
  initialize: function () {
    this.listenTo(App, 'page', this.handleNewPage);
    this.homePath = window.location.pathname.startsWith("/user") ? "/hub/spawn" : "stochss/home"
    this.ulClosed = false;
  },
  events: {
    'click [data-hook=registration-link-button]' : 'handleRegistrationLinkClick',
    'click [data-hook=user-logs-collapse]' : 'collapseExpandLogs',
    'click [data-hook=clear-user-logs]' : 'clearUserLogs',
    'click [data-hook=close-user-logs]' : 'closeUserLogs',
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
    if(app.getBasePath() === "/") {
      $("#presentation-nav-link").css("display", "none");
    }
    this.setupUserLogs();
    return this;
  },
  addNewLogBlock: function () {
    if(this.logBlock.length > 0) {
      let logBlock = this.logBlock.join("<br>");
      this.logBlock = [];
      $("#user-logs").append("<p class='mb-1' style='white-space:pre'>" + logBlock + "</p>")
      return ""
    }
    return "<br>"
  },
  addNewLogs: function (newLogs) {
    let self = this;
    let logList = newLogs.map(function (log) {
      if(log.includes("$ ")){
        let head = self.addNewLogBlock();
        var newLog = self.formatLog(log);
        $("#user-logs").append(head + newLog.toHtmlEntities());
      }else{
        var newLog = log;
        if(newLog.trim()) {
          self.logBlock.push(newLog.toHtmlEntities());
        }
      }
      self.logs.push(newLog);
    });
    this.addNewLogBlock();
  },
  clearUserLogs: function (e) {
    let endpoint = path.join(app.getApiPath(), "clear-user-logs");
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.setupUserLogs({getLogs: false});
      }
    });
  },
  closeUserLogs: function (e) {
    let open = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
      </svg>
    `
    let closed = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
      </svg>
    `
    let logs = $("#user-logs-body");
    if(logs.css("display") === "block") {
      logs.css("display", "none");
      $(this.queryByHook("user-logs-collapse")).css("display", "none");
      this.ulClosed = true;
      $(this.queryByHook("close-user-logs")).html(closed);
    }else{
      logs.css("display", "block");
      $(this.queryByHook("user-logs-collapse")).css("display", "inline-block");
      this.ulClosed = false;
      this.updateUserLogs();
      $(this.queryByHook("close-user-logs")).html(open);
    }
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
    let element = document.querySelector("#user-logs");
    element.scrollTop = element.scrollHeight;
  },
  getUserLogs: function () {
    if(this.ulClosed) { return; }
    let self = this;
    let queryStr = "?logNum=" + this.logs.length;
    let endpoint = path.join(app.getApiPath(), "user-logs") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        if(body) {
          let scrolled = self.scrolled;
          self.addNewLogs(body.logs);
          if(!self.scrolled){
            let element = document.querySelector("#user-logs");
            element.scrollTop = element.scrollHeight;
          }else if(self.scrollCount < 60) {
            self.scrollCount += 1;
          }else{
            self.scrolled = false;
            self.scrollCount = 0;
          }
        }
        self.updateUserLogs();
      }
    });
  },
  formatLog: function (log) {
    var time = log.split('$ ')[0];
    let date = new Date(time);
    let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    var stamp = months[date.getMonth()] + " ";
    stamp += date.getDate() + ", ";
    stamp += date.getFullYear() + "  ";
    let hours = date.getHours();
    stamp += (hours < 10 ? "0" + hours : hours) + ":";
    let minutes = date.getMinutes();
    stamp += (minutes < 10 ? '0' + minutes : minutes) + ":";
    return log.replace(time, stamp);
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
  setupUserLogs: function ({getLogs = true}={}) {
    let message = app.getBasePath() === "/" ? "Welcome to StochSS!" : "Welcome to StochSS Live!";
    $("#user-logs").html(message)
    this.logBlock = [];
    this.logs = [];
    this.scrolled = false;
    this.scrollCount = 0;
    if(getLogs) {
      this.getUserLogs();
      $("#user-logs").on("mousewheel", (e) => {
        this.scrolled = true;
        this.scrollCount = 0;
      });
    }
  },
  updateUserLogs: function () {
    setTimeout(_.bind(this.getUserLogs, this), 1000);
  }
});
