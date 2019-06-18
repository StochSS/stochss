var app = require('ampersand-app');
var _ = require('underscore');
var ViewSwitcher = require('ampersand-view-switcher');
// Models
var Model = require('../models/model');
var ModelVersion = require('../models/model-version');
// Views
var PageView = require('./base');
var ModelVersionEditorView = require('../views/model-version-editor');
var InputView = require('../views/input');

var template = require('../templates/pages/modelEditor.pug');

module.exports = PageView.extend({
  template: template,
  events: {
    "change [data-hook='version-select']": "versionSelectChange"
  },
  bindings: {
    'model.version_open_tag': {
      type: function (el, value, previousValue) {
        el.value = String(value);
        var options = this.queryAll('option');
        options.forEach(function(option) {
          option.selected = parseInt(option.value) === value;
        });
      },
      hook: 'version-select'
    },
    'model.name': {
      type: 'text',
      hook: 'name'
    }
  },
  initialize: function (attrs) {
    var self = this;
    // TODO just get the model we need, not everything
    //app.models.fetch()
    var id = attrs.id
    if (!id) {
      // No id passed to the page, so we're making a new model
      // TODO: abstract this block
      var m = new Model({
        public: false,
        is_stochastic: false,
        is_spatial: false,
        username: app.me.name
      });
      m.version_open_tag = m.latest_version;
      m.versions.add({ version: m.latest_version });
      this.model = m;
      app.models.add(this.model);
    } else {
      var m = app.models.find(function (m) { return m.id == id });
      this.model = m;
    }

    this.versionEditorViews = this.model.versions.map(function (m) {
      m.view = m.view || new ModelVersionEditorView({
        parent: self,
        model: m
      })
      return m.view;
    });
  },
  render: function () {
    this.renderWithTemplate();
    this.versionEditorContainer = this.queryByHook('model-version-editor-container');
    this.versionEditorSwitcher = new ViewSwitcher({
      el: this.versionEditorContainer,
    });
    this.setSelectedView();
  },
  versionSelectChange: function (e) {
    this.model.version_open_tag = parseInt(e.target.value);
    this.setSelectedView();
  },
  setSelectedView: function (e) {
    this.versionEditorSwitcher.set(this.model.version_open.view);
  },
  update: function () {
    // Must be defined for the input view to function
  },
  subviews: {
    inputModelName: {
      hook: 'name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: 'Name:',
          modelKey: 'name',
          value: this.model.name || ''
        });
      }
    }
  }

});
