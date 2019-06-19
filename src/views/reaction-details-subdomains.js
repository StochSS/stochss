var app = require('ampersand-app');
//views
var View = require('ampersand-view');
var SubdomainsView = require('./subdomains');

var template = require('../templates/includes/reactionDetailsSubdomains.pug');

module.exports = View.extend({
  template: template,
  initialize: function (args) {
    this.isReaction = args.isReaction;
    app.on('mesh-update', this.renderSubdomains, this);
  },
  render: function () {
    this.renderWithTemplate();
    this.renderSubdomains();
  },
  renderSubdomains: function () {
    this.baseModel = this.parent.model.collection.parent;
    if(this.subdomainsView)
      this.subdomainsView.remove();
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains;
    this.subdomainsView = this.renderCollection(
      subdomains,
      SubdomainsView,
      this.queryByHook('reaction-subdomains')
    );
  },
  updateSubdomains: function (element) {
    this.parent.updateSubdomains(element);
  }
})