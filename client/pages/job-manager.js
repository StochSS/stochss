var _ = require('underscore');
var $ = require('jquery');
var tests = require('../views/tests');
var path = require('path');
var xhr = require('xhr');
//views
var PageView = require('./base');
var JobEditorView = require('../views/job-editor');
var InputView = require('../views/input');
//templates
var template = require('../templates/pages/JobManager.pug');

import initPage from './page.js';

let JobManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=job-name]' : 'setJobName'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    this.directory = document.URL.split('/jobs/edit').pop();
    if(this.directory.endsWith('.mdl')){
      var modelFile = this.directory.split('/').pop();
      var name = modelFile.split('.')[0];
      this.modelDirectory = this.directory
      this.jobDate = this.getCurrentDate();
      this.jobName = name + this.jobDate;
    }else{
      var endpoint = path.join("/stochss/api/jobs/job-info", this.directory, "/info.json")
      xhr({uri: endpoint}, function (err, response, body){
        self.modelDirectory = JSON.parse(body).model.split('/home/jovyan').pop()
        var jobDir = self.directory.split('/').pop()
        self.jobName = jobDir.split('.')[0]
        var statusEndpoint = path.join("/stochss/api/jobs/job_status", self.directory)
        xhr({uri: statusEndpoint}, function (err, response, body) {
          self.status = String(body);
          self.renderSubviews();
        });
      });
    }
  },
  render: function () {
    PageView.prototype.render.apply(this, arguments);
    if(this.modelDirectory){
      this.renderSubviews()
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderSubviews: function () {
    var jobEditor = new JobEditorView({
      directory: this.modelDirectory,
    });
    var inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Job Name: ',
      tests: tests.nameTests,
      modelKey: null,
      valueType: 'string',
      value: this.jobName,
    });
    this.registerRenderSubview(jobEditor, 'job-editor-container');
    this.registerRenderSubview(inputName, 'job-name');
    $(this.queryByHook("job-name")).find('input').width(1350)
    if(this.status){
      this.disableJobNameInput();
    }
    if(this.status && this.status !== 'ready'){
      jobEditor.collapseContainer();
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setJobName: function(e) {
    var newJobName = e.target.value;
    if(newJobName.endsWith(this.jobDate)){
      this.jobName = newJobName
    }else{
      this.jobName = newJobName + this.jobDate
      e.target.value = this.jobName
    }
  },
  getCurrentDate: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return "_" + month + day + year + "_" + hours + minutes + seconds
  },
  disableJobNameInput: function() {
    $(this.queryByHook("job-name")).find('input').prop('disabled', true);
  },
});

initPage(JobManager);