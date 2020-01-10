var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditParameterView = require('./edit-parameter');
//templates
var template = require('../templates/includes/parametersEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    var self = this;
    View.prototype.initialize.apply(this, arguments);
    this.collection.on('update-parameters', function (name, parameter) {
      self.collection.parent.reactions.map(function (reaction) {
        if(reaction.rate && reaction.rate.name === name){
          reaction.rate = parameter;
        }
      });
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('parameter-list')
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addParameter: function () {
    this.collection.addParameter();
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});