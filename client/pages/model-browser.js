var PageView = require('./base');
var ModelListingView = require('../views/model-listing');
var template = require('../templates/pages/modelBrowser.pug');

module.exports = PageView.extend({
  template: template,
  events: {
    
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, ModelListingView, this.queryByHook('model-list'));
    if (!this.collection.length) { this.collection.fetch(); }
  }
});
