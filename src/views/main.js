var _ = require('underscore');
//var setFavicon = require('favicon-setter');
var app = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var localLinks = require('local-links');
var domify = require('domify');

var headTemplate = require('!pug-loader!../templates/head.pug');
var bodyTemplate = require('!pug-loader!../templates/body.pug');

module.exports = View.extend({
  template: bodyTemplate,
  autoRender: true,
  initialize: function () {
      this.listenTo(app, 'page', this.handleNewPage);
  },
  events: {
    'click a[href]': 'handleLinkClick'
  },
  render: function () {

    document.head.appendChild(domify(headTemplate()));

    this.renderWithTemplate(this);
    
    this.pageContainer = this.queryByHook('page-container');

    this.pageSwitcher = new ViewSwitcher({
      el: this.pageContainer,
      show: function (newView, oldView) {
        document.title = _.result(newView, 'pageTitle') || 'StochSS';
        document.scrollTop = 0;
        
        app.currentPage = newView;
      }
    });

    return this;
  },
  
  handleNewPage: function (view) {
    this.pageSwitcher.set(view);
    //this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    var localPath = localLinks.pathname(e);

    if (localPath) {
      e.preventDefault();
      app.navigate(localPath);
    }
  }
});
