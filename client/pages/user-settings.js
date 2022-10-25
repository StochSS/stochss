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
// support files
let app = require('../app');
let tests = require('../views/tests');
// models
let Settings = require('../models/user-settings');
// views
let PageView = require('./base');
let InputView = require('../views/input');
let SelectView = require('ampersand-select-view');
// templates
let template = require('../templates/pages/userSettings.pug');

import initPage from './page.js';

let userSettings = PageView.extend({
  template: template,
  events: {
    'change [data-hook=user-logs]' : 'toggleUserLogs',
    'change [data-target=aws-credentials]' : 'toggleAWSComputeNodeSection',
    'change [data-hook=aws-secretaccesskey-container]' : 'handleSetSecretKey',
    'change [data-hook=aws-instancetype-container]' : 'handleSelectInstanceType',
    'change [data-hook=aws-instancesize-container]' : 'handleSelectInstanceSize',
    'click [data-hook=apply-user-settings]' : 'handleApplyUserSettings'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.model = new Settings();
    this.secretKey = null;
    app.getXHR(this.model.url(), {
      success: (err, response, body) => {
        this.model.set(body.settings);
        this.instances = body.instances;
        if(this.model.headNode === "") {
          this.awsType = "";
          this.awsSize = "";
        }else{
          let data = this.model.headNode.split('.')
          this.awsType = data[0];
          this.awsSize = data[1];
          this.renderAWSInstanceSizesView();
        }
        this.renderAWSInstanceTypesView();
      }
    });
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
  },
  handleApplyUserSettings: function () {
    let options = this.secretKey !== null ? {secretKey: this.secretKey} : {};
    this.model.applySettings(() => {
      location.reload();
    }, options);
  },
  handleSelectInstanceSize: function (e) {
    this.awsSize = e.target.value;
    this.model.headNode = `${this.awsType}.${this.awsSize}`;
  },
  handleSelectInstanceType: function (e) {
    this.awsType = e.target.value;
    this.renderAWSInstanceSizesView();
  },
  handleSetSecretKey: function (e) {
    this.secretKey = e.target.value;
    this.toggleAWSComputeNodeSection();
  },
  renderAWSInstanceSizesView: function () {
    if(this.awsInstanceSizesView) {
      this.awsInstanceSizesView.remove();
    }
    let options = this.instances[this.awsType];
    this.awsInstanceSizesView = new SelectView({
      name: 'aws-instance-size',
      required: false,
      idAttributes: 'cid',
      options: options,
      value: this.awsSize,
      unselectedText: "-- Select Instance Size --"
    });
    let hook = "aws-instancesize-container";
    app.registerRenderSubview(this, this.awsInstanceSizesView, hook);
  },
  renderAWSInstanceTypesView: function () {
    if(this.awsInstanceTypesView) {
      this.awsInstanceTypesView.remove();
    }
    let options = Object.keys(this.instances);
    this.awsInstanceTypesView = new SelectView({
      name: 'aws-instance-type',
      required: false,
      idAttributes: 'cid',
      options: options,
      value: this.awsType,
      unselectedText: "-- Select Instance Type --"
    });
    let hook = "aws-instancetype-container";
    app.registerRenderSubview(this, this.awsInstanceTypesView, hook);
  },
  toggleAWSComputeNodeSection: function () {
    let regionSet = this.model.awsRegion !== "";
    let accessKeySet = this.model.awsAccessKeyID !== "";
    let secretKeySet = this.secretKey !== null;
    let display = regionSet && accessKeySet && secretKeySet ? "block" : "none";
    $(this.queryByHook('aws-compute-node-section')).css('display', display);
  },
  toggleUserLogs: function (e) {
    this.model.userLogs = e.target.checked;
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    awsRegionInputView: {
      hook: 'aws-region-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'aws-region',
          modelKey: 'awsRegion',
          valueType: 'string',
          value: this.model.awsRegion
        });
      }
    },
    awsAccessKeyID: {
      hook: 'aws-accesskeyid-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'aws-access-key-id',
          modelKey: 'awsAccessKeyID',
          valueType: 'string',
          value: this.model.awsAccessKeyID
        });
      }
    },
    awsSecretAccessKey: {
      hook: 'aws-secretaccesskey-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          type: 'password',
          required: false,
          name: 'aws-secret-access-key',
          valueType: 'string',
        });
      }
    }
  }
});

initPage(userSettings);
