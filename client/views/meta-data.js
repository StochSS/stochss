/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

let $ = require('jquery');
var path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//collections
let Creators = require('../models/creators');
//models
let Creator = require('../models/creator');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let CreatorListingView = require('./creator-listing');
//templates
let template = require('../templates/includes/metaData.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=file-select-view]' : 'updateMetaData',
    'change [data-hook=description-input-view]' : 'updateFileDescription',
    'change [data-hook=creator-select-view]' : 'updateCreator',
    'change [data-hook=email-input-view]' : 'toggleAddCreatorBtn',
    'click [data-hook=metadata-collapse-btn]' : 'changeCollapseButtonText',
    'click [data-hook=add-creator-btn]' : 'handleAddCreatorClick',
    'click [data-hook=save-meta-data-button]' : 'saveMetaData'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.files = this.model.workflowGroups.map(function (wkgp) {
      return wkgp.name;
    });
    this.files.unshift(this.model.name);
    this.metadata = this.model.metadata;
    this.selectedCreator = "New Creator";
    this.model.creators.forEach(function (creator) {
      if(!creator.elementID) {
        creator.elementID = "C" + (creator.collection.indexOf(creator) + 1);
      }
    });
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderFilesSelectView();
    this.renderCreatorListingView();
    $(this.queryByHook("description-input-view")).val(this.metadata.description);
    this.renderCreatorsSelectView();
    this.renderCreatorsInputViews();
  },
  addCreator: function (status, creator) {
    if(status === "new") {
      creator = this.model.creators.addCreator(creator);
    }
    this.metadata.creators.push(creator.elementID);
    this.selectedCreator = "New Creator";
    this.renderCreatorListingView();
    this.renderCreatorsSelectView();
    this.renderCreatorsInputViews();
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  handleAddCreatorClick: function (e) {
    let fName = $(this.queryByHook("given-name-input-view")).find("input").val();
    let lName = $(this.queryByHook("family-name-input-view")).find("input").val();
    let email = $(this.queryByHook("email-input-view")).find("input").val();
    let organization = $(this.queryByHook("organization-input-view")).find("input").val();
    if(this.selectedCreator === "New Creator"){
      let creator = {"fname":fName,"lname":lName,"email":email,"organization":organization}
      this.addCreator("new", creator);
    }else{
      let creator = this.model.creators.get(this.selectedCreator, "elementID");
      creator.fname = fName;
      creator.lname = lName;
      creator.email = email;
      creator.organization = organization;
      this.addCreator("existing", creator);
    }
  },
  renderCreatorListingView: function () {
    if(this.creatorListingView) {
      this.creatorListingView.remove();
    }
    let self = this;
    let listOfCreators = this.metadata.creators.map(function (key) {
      return self.model.creators.get(key, "elementID");
    });
    let creators = new Creators(listOfCreators);
    this.creatorListingView = this.renderCollection(creators, CreatorListingView, this.queryByHook("list-of-creators"));
  },
  renderCreatorsInputViews: function () {
    if(this.emailInputView) {
      this.fnameInputView.remove();
      this.lnameInputView.remove();
      this.emailInputView.remove();
      this.orgInputView.remove();
    }
    let creator = this.selectedCreator === "New Creator" ? "" : this.model.creators.get(this.selectedCreator, "elementID");
    this.fnameInputView = new InputView({parent: this, required: false, name: 'given-name', label: 'Given Name: ',
                                         modelKey: 'fname', valueType: 'string',
                                         value: this.selectedCreator !== "New Creator" ? creator.fname : ""});
    app.registerRenderSubview(this, this.fnameInputView, "given-name-input-view");
    this.lnameInputView = new InputView({parent: this, required: false, name: 'family-name', label: 'Family Name: ',
                                         modelKey: 'lname', valueType: 'string',
                                         value: creator.lname ? creator.lname : ""});
    app.registerRenderSubview(this, this.lnameInputView, "family-name-input-view");
    this.emailInputView = new InputView({parent: this, required: true, placeholder: 'e-mail required', name: 'email',
                                         label: 'e-Mail: ', modelKey: 'email', valueType: 'string',
                                         value: creator.email ? creator.email : ""});
    app.registerRenderSubview(this, this.emailInputView, "email-input-view");
    this.orgInputView = new InputView({parent: this, required: false, name: 'organization', label: 'Organization: ',
                                       modelKey: 'organization', valueType: 'string',
                                       value: creator.organization ? creator.organization : ""});
    app.registerRenderSubview(this, this.orgInputView, "organization-input-view");
    $(this.queryByHook("add-creator-btn")).prop('disabled', this.selectedCreator === "New Creator");
  },
  renderCreatorsSelectView: function () {
    if(this.creatorsSelectView){
      this.creatorsSelectView.remove();
    }
    let options = this.model.creators.map(function (creator) {
      return [creator.elementID, creator.email];
    });
    this.creatorsSelectView = new SelectView({
      label: 'Creator: ',
      name: 'creator',
      required: false,
      idAttribute: 'cid',
      eagerValidate: true,
      options: options,
      unselectedText: "New Creator"
    });
    app.registerRenderSubview(this, this.creatorsSelectView, "creator-select-view");
  },
  renderFilesSelectView: function() {
    if(this.filesSelectView) {
      this.filesSelectView.remove();
    }
    this.filesSelectView = new SelectView({
      label: 'File: ',
      name: 'file',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.files,
      value: this.model.name
    });
    app.registerRenderSubview(this, this.filesSelectView, "file-select-view");
  },
  saved: function () {
    $(this.queryByHook('md-in-progress')).css("display", "none");
    $(this.queryByHook('md-complete')).css("display", "inline-block");
    let self = this;
    setTimeout(function () {
      $(self.queryByHook("md-complete")).css("display", "none");
    }, 5000);
  },
  saving: function () {
    $(this.queryByHook('md-in-progress')).css("display", "inline-block");
    $(this.queryByHook('md-complete')).css("display", "none");
  },
  saveMetaData: function (e) {
    this.saving();
    let data = {}
    data[this.model.directory] = {"metadata":this.model.metadata, "creators":this.model.creators};
    this.model.workflowGroups.forEach(function (wkgp) {
      data[wkgp.name + ".wkgp"] = {"metadata": wkgp.metadata};
    });
    let self = this;
    let endpoint = path.join(app.getApiPath(), "project/meta-data")+"?path="+this.model.directory;
    app.postXHR(endpoint, data, {
      success: function (err, response, body) {
        self.saved();
      }
    });
  },
  toggleAddCreatorBtn: function (e) {
    $(this.queryByHook("add-creator-btn")).prop('disabled', !Boolean(e.target.value));
  },
  update: function () {},
  updateFileDescription: function (e) {
    this.metadata.description = e.target.value;
  },
  updateCreator: function (e) {
    this.selectedCreator = e.target.value ? e.target.value : "New Creator";
    this.renderCreatorsInputViews();
    $(this.queryByHook("add-creator-btn")).prop('disabled', this.selectedCreator === "New Creator");
    let creator = this.model.creators.get(this.selectedCreator, "elementID");
    if(creator && this.metadata.creators.includes(creator.elementID)) {
      $(this.queryByHook("add-creator-btn")).text("Update");
    }else{
      $(this.queryByHook("add-creator-btn")).text("Add");
    }
  },
  updateMetaData: function (e) {
    let selectedFile = e.target.selectedOptions.item(0).text;
    this.metadata = selectedFile !== this.model.name ? this.model.workflowGroups.filter(function (wkgp) {
      return wkgp.name === selectedFile;
    })[0].metadata : this.model.metadata;
    $(this.queryByHook("description-input-view")).val(this.metadata.description);
    this.renderCreatorListingView();
  },
  updateValid: function () {}
});