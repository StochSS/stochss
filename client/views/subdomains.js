var app = require('ampersand-view');
var _ = require('underscore');
var $ = require('jquery');
//views
var View = require('ampersand-view');

var template = require('../templates/includes/subdomains.pug');
var reactionTemplate = require('../templates/includes/reactionSubdomains.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=subdomain]' : 'updateSubdomain'
  },
  render: function () {
    if(!this.parent.isReaction)
      var checked = _.contains(this.parent.model.spatialSpecies.subdomains, this.model.name);
    else{
      this.template = reactionTemplate;
      var checked = _.contains(this.parent.parent.model.subdomains, this.model.name);
    }
    this.renderWithTemplate();
    $(this.queryByHook('subdomain')).prop('checked', checked);
  },
  updateSubdomain: function (e) {
    this.parent.updateSubdomains({name: 'subdomain', value: {model: this.model, checked: e.target.checked}});
  }
})