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

let path = require('path');
//support files
let app = require('../app');
//models
let Model = require('ampersand-model');

module.exports = Model.extend({
  url: function () {
    return path.join(app.getApiPath(), "user-settings");
  },
  props: {
    awsAccessKeyID: 'string',
    awsRegion: 'string',
    headNode: 'string',
    userLogs: 'boolean'
  },
  session: {
    awsSecretKey: "string"
  },
  applySettings: function (cb, {secretKey=null}={}) {
    let data = {
      settings: this.toJSON(),
      secret_key: secretKey
    }
    app.postXHR(this.url(), data, { success: cb });
  }
});
