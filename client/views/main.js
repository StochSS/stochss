var _ = require('underscore');
var $ = require('jquery');
//var setFavicon = require('favicon-setter');
var app = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var localLinks = require('local-links');
var domify = require('domify');
var path = require('path');

var headTemplate = require('!pug-loader!../templates/head.pug');
var bodyTemplate = require('!pug-loader!../templates/body.pug');

let operationInfoModalHtml = (infoKey) => {
  let fileBrowserInfo = `
    <p>In StochSS we use custom file extensions for a number of files we work with.  Here is a list of our extentions with the files they are associated with:</p>
    <table style="margin-left: 2em;">
      <tr>
        <td width=200> StochSS Model </td>
        <td> .mdl </td>
      </tr>
      <tr>
        <td width=200> StochSS Spatial Model </td>
        <td> .smdl </td>
      </tr>
      <tr>
        <td width=200> SBML Model </td>
        <td> .sbml </td>
      </tr>
      <tr>
        <td width=200> Workflows </td>
        <td> .wkfl </td>
      </tr>
    </table>
    <br>
    <p>Other useful file extensions include the following:</p>
    <table style="margin-left: 2em;">
      <tr>
        <td width=200> Jupyter Notebook </td>
        <td> .ipynb </td>
      </tr>
    </table>
  `;
  let modelInfo = `
    Model Information
  `;
  let workflowInfo = `
    Workflow Information
  `;

  let infoList = {"File Browser":fileBrowserInfo, "Models":modelInfo, "Workflows":workflowInfo}
  
  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Working with ${infoKey} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${infoList[infoKey]} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

module.exports = View.extend({
  template: bodyTemplate,
  autoRender: true,
  initialize: function () {
      this.listenTo(app, 'page', this.handleNewPage);
  },
  events: {
    'click [data-hook=registration-link-button]' : 'handleRegistrationLinkClick',
    //'click a[href]': 'handleLinkClick'
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

    var homePath = window.location.pathname.startsWith("/user") ? "/hub/stochss" : "stochss/home"
    $(this.queryByHook("home-link")).prop('href', homePath);

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
      this.navigate(localPath);
    }
  },

  handleRegistrationLinkClick: function () {
    $(this.queryByHook("registration-form")).collapse('show');
    $(this.queryByHook("registration-link")).collapse();
  },

  navigate: function (page) {
    window.location = url;
  }
});
