var _ = require('underscore');
var $ = require('jquery');
var tests = require('../views/tests');
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
      var jobDate = this.getCurrentDate();
      this.jobName = name + jobDate;
      this.isCreated = false
    }else{
      var endpoint = path.join("", directory, "/info.json")
      xhr({uri: endpoint}, function (err, response, boby){
        this.modelDirectory = JSON.parse(body.model.split('/home/jovyan').pop())
        var jobDir = this.directory.split('/').pop()
        this.jobName = jobDir.split('.')[0]
        this.isCreated = true;
      })
    }
  },
  render: function () {
    PageView.prototype.render.apply(this, arguments);
    $(this.queryByHook("job-name")).find('input').width(500)
    if(this.directory.endsWith('.job')||this.isCreated){
      this.disableJobNameInput();
    }
    this.renderSubviews();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderSubviews: function () {
    var jobEditor = new JobEditorView({
      directory: this.modelDirectory,
    });
    this.registerRenderSubview(jobEditor, 'job-editor-container')
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setJobName: function(e) {
    this.jobName = e.target.value
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
  subviews: {
    inputName: {
      hook: 'job-name',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: 'Job Name',
          tests: tests.nameTests,
          modelKey: '',
          valueType: 'string',
          value: this.jobName,
        });
      },
    },
  }
});

initPage(JobManager);