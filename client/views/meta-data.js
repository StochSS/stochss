/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
//support files
let app = require('../app');
//collections
let Creators = require('../models/creators');
//views
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
    'click [data-hook=metadata-collapse-btn]' : 'changeCollapseButtonText'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.files = this.model.workflowGroups.map(function (wkgp) {
      return wkgp.name;
    });
    this.files.unshift(this.model.name);
    this.metadata = this.model.metadata;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderFilesSelectView();
    this.renderCreatorListingView();
    $(this.queryByHook("description-input-view")).val(this.metadata.description);
    this.renderCreatorsSelectView();
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  renderCreatorListingView: function () {
    if(this.creatorListingView) {
      this.creatorListingView.remove();
    }
    let self = this;
    let listOfCreators = this.metadata.creators.map(function (key) {
      return self.model.creators.get(key, "email");
    });
    let creators = new Creators(listOfCreators);
    this.creatorListingView = this.renderCollection(creators, CreatorListingView, this.queryByHook("list-of-creators"));
  },
  renderCreatorsSelectView: function () {
    if(this.creatorsSelectView){
      this.creatorsSelectView.remove();
    }
    this.creatorsSelectView = new SelectView({
      label: 'Creator: ',
      name: 'creator',
      required: false,
      idAttribute: 'cid',
      textAttribute: 'email',
      eagerValidate: true,
      options: this.model.creators,
      unselectedText: "New Creator"
    });
    app.registerRenderSubview(this, this.creatorsSelectView, "creator-select-view")
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
  updateFileDescription: function (e) {
    this.metadata.description = e.target.value
  },
  updateCreator: function (e) {
    // if(e){
    //   this.selectedCreator = e.target.selectedOptions.item(0).text
    // }
    // var fName = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].fname
    // var lName = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].lname
    // var email = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].email
    // var organization = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].organization
    // $(this.queryByHook("given-name-input-view")).find("input").val(fName)
    // $(this.queryByHook("family-name-input-view")).find("input").val(lName)
    // $(this.queryByHook("email-input-view")).find("input").val(email)
    // $(this.queryByHook("organization-input-view")).find("input").val(organization)
    // $(this.queryByHook("add-creator-btn")).prop('disabled', this.selectedCreator === "New Creator")
    // if(this.metaData[this.selectedFile].creators.includes(this.selectedCreator)) {
    //   $(this.queryByHook("add-creator-btn")).text("Update")
    // }else{
    //   $(this.queryByHook("add-creator-btn")).text("Add")
    // }
  },
  updateMetaData: function (e) {
    let selectedFile = e.target.selectedOptions.item(0).text;
    this.metadata = selectedFile !== this.model.name ? this.model.workflowGroups.filter(function (wkgp) {
      return wkgp.name === selectedFile;
    })[0].metadata : this.model.metadata;
    $(this.queryByHook("description-input-view")).val(this.metadata.description)
    this.renderCreatorListingView();
  }
});