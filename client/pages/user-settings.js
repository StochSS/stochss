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

// support files
let app = require('../app');
let tests = require('../views/tests');
// models
let Settings = require('../models/user-settings');
// views
let PageView = require('./base');
let InputView = require('../views/input');
// templates
let template = require('../templates/pages/userSettings.pug');

import initPage from './page.js';

let userSettings = PageView.extend({
  template: template,
  events: {
    'change [data-hook=user-logs]' : 'toggleUserLogs'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.model = new Settings();
    app.getXHR(this.model.url(), {
      success: (err, response, body) => {
        this.model.set(body.settings);
        this.instances = body.instances;
      }
    });
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
  },
  toggleUserLogs: function (e) {
    this.model.userLogs = e.target.checked;
    console.log(this.model)
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
