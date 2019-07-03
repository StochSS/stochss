var path = require('path');
var Model = require('ampersand-model');
var ModelVersions = require('./model-versions');
var config = require('../config.js')(process.env.NODE_ENV);

module.exports = Model.extend({
  props: {
    id: 'number',
    latest_version: {
      type: 'number',
      default: 1
    },
    username: 'string',
    name: 'string',
    public: 'boolean',
    is_spatial: 'boolean',
  },
  collections: {
    versions: ModelVersions
  },
  derived: {
    version_tags: {
      deps: ['versions'],
      fn: function () {
        return this.versions.pluck('version').sort().map(function (t) { return String(t) });
      }
    },
    version_open: {
      deps: ['version_open_tag'],
      fn: function () {
        var self = this;
        return this.versions.find(function (v) {
          return v.version === self.version_open_tag
        });
      }
    }
  },
  session: {
    version_open_tag: {
      type: 'number'
    }
  }
});
