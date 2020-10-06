var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
//support files
var app = require('../app');
var tests = require('./tests');
var modals = require('../modals');
//collections
var Collection = require('ampersand-collection');
//models
var Creator = require('../models/creator');
//views
var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
var InputView = require('./input');
var CreatorListingView = require('./creator-listing');
//templates
var template = require('../templates/includes/metaData.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=file-select-view]' : 'updateMetaData',
    'change [data-hook=description-input-view]' : 'updateFileDescription',
    'change [data-hook=creator-select-view]' : 'updateCreator',
    'click [data-hook=add-creator-btn]' : 'handleAddCreatorClick',
    'change [data-hook=email-input-view]' : 'toggleAddCreatorBtn',
    'click [data-hook=save-meta-data-button]' : 'saveMetaData',
    'click [data-hook=submit-meta-data-button]' : 'submitMetaData'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.projectName = attrs.projectName;
    this.files = attrs.files;
    this.path = attrs.path;
    this.download = attrs.download;
    this.selectedFile = attrs.projectName;
    this.selectedCreator = "New Creator"
    let self = this
    let queryString = "?path="+this.parent.projectPath+"&files="+this.files.join(',')
    let endpoint = path.join(app.getApiPath(), "project/meta-data")+queryString
    xhr({uri:endpoint, json:true}, function(err, response, body) {
      if(response.statusCode < 400) {
        self.metaData = body.meta_data
        self.creators = body.creators
        self.renderSubviews()
      }
    })
  },
  update: function() {},
  renderSubviews: function () {
    this.renderFilesSelectView()
    this.renderCreatorListingView()
    this.renderCreatorsSelectView()
    let fileMetaData = this.metaData[this.selectedFile]
    $(this.queryByHook("description-input-view")).val(fileMetaData["description"])
    $(document).ready(function () {
      $("html, body").animate({ 
          scrollTop: $("#project-meta-data-container").offset().top - 50
      }, false);
    });
  },
  renderFilesSelectView: function() {
    if(this.filesSelectView) {
      this.filesSelectView.remove()
    }
    this.filesSelectView = new SelectView({
      label: 'File: ',
      name: 'file',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.files,
      value: this.projectName
    });
    this.registerRenderSubview(this.filesSelectView, "file-select-view");
  },
  renderCreatorListingView: function () {
    if(this.creatorListingView) {
      this.creatorListingView.remove()
    }
    let self = this
    let listOfCreators = this.metaData[this.selectedFile].creators.map(function (key) {
      return self.creators[key]
    });
    let creators = new Collection(listOfCreators, {model: Creator})
    this.creatorListingView = this.renderCollection(creators, CreatorListingView, this.queryByHook("list-of-creators"))
  },
  renderCreatorsSelectView: function () {
    if(this.creatorsSelectView){
      this.creatorsSelectView.remove()
    }
    var options = Object.keys(this.creators)
    options.unshift("New Creator")
    this.creatorsSelectView = new SelectView({
      label: 'Creator: ',
      name: 'creator',
      required: false,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: options,
      value: this.selectedCreator
    });
    this.registerRenderSubview(this.creatorsSelectView, "creator-select-view")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  updateMetaData: function (e) {
    this.selectedFile = e.target.selectedOptions.item(0).text
    let fileMetaData = this.metaData[this.selectedFile]
    $(this.queryByHook("description-input-view")).val(fileMetaData["description"])
    this.renderCreatorListingView()
    this.selectedCreator = "New Creator"
    this.renderCreatorsSelectView()
    this.updateCreator(undefined)
  },
  updateFileDescription: function (e) {
    let description = e.target.value
    this.metaData[this.selectedFile]["description"] = description
  },
  updateCreator: function (e) {
    if(e){
      this.selectedCreator = e.target.selectedOptions.item(0).text
    }
    var fName = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].fname
    var lName = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].lname
    var email = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].email
    var organization = this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator].organization
    $(this.queryByHook("given-name-input-view")).find("input").val(fName)
    $(this.queryByHook("family-name-input-view")).find("input").val(lName)
    $(this.queryByHook("email-input-view")).find("input").val(email)
    $(this.queryByHook("organization-input-view")).find("input").val(organization)
    $(this.queryByHook("add-creator-btn")).prop('disabled', this.selectedCreator === "New Creator")
    if(this.metaData[this.selectedFile].creators.includes(this.selectedCreator)) {
      $(this.queryByHook("add-creator-btn")).text("Update")
    }else{
      $(this.queryByHook("add-creator-btn")).text("Add")
    }
  },
  handleAddCreatorClick: function (e) {
    let fName = $(this.queryByHook("given-name-input-view")).find("input").val()
    let lName = $(this.queryByHook("family-name-input-view")).find("input").val()
    let email = $(this.queryByHook("email-input-view")).find("input").val()
    let organization = $(this.queryByHook("organization-input-view")).find("input").val()
    if(email in this.creators && this.selectedCreator === "New Creator"){
      if(document.querySelector("#existingCreatorConfirmationModal")) {
        document.querySelector("#existingCreatorConfirmationModal").remove()
      }
      let self = this
      let message = "A creator already exists with this email. Do you wish to update that creators information?"
      let modal = $(modals.existingCreatorConfirmationHtml(message)).modal()
      let yesBtn = document.querySelector("#existingCreatorConfirmationModal .yes-modal-btn")
      yesBtn.addEventListener('click', function (e) {
        modal.modal('hide')
        let creator = {"fname":fName,"lname":lName,"email":email,"organization":organization}
        self.addCreator(email, creator)
      })
      console.log("A creator already exists with this name. Do you wish to update that creators data?")
    }else if(this.selectedCreator !== "New Creator" && email !== this.selectedCreator){
      let index = this.metaData[this.selectedFile].creators.indexOf(this.selectedCreator)
      this.metaData[this.selectedFile].creators.splice(index, 1)
      let creator = {"fname":fName,"lname":lName,"email":email,"organization":organization}
      this.addCreator(email, creator)
    }else{
      let creator = {"fname":fName,"lname":lName,"email":email,"organization":organization}
      this.addCreator(email, creator)
    }
  },
  addCreator: function (key, creator) {
    this.creators[key] = creator
    if(!this.metaData[this.selectedFile].creators.includes(key)){
      this.metaData[this.selectedFile].creators.push(key)
    }
    this.selectedCreator = key
    this.renderCreatorsSelectView()
    $(this.queryByHook("add-creator-btn")).text("Update")
    this.renderCreatorListingView()
  },
  toggleAddCreatorBtn: function (e) {
    $(this.queryByHook("add-creator-btn")).prop('disabled', !Boolean(e.target.value))
  },
  saveMetaData: function (e) {
    let data = {"meta-data":this.metaData,"creators":this.creators}
    let endpoint = path.join(app.getApiPath(), "project/meta-data")+"?path="+this.parent.projectPath
    xhr({uri:endpoint, json:true, method:"post", body:data}, function (err, response, body) {
      if(response.statusCode < 400) {
        console.log("Successfully Saved Mete Data")
      }
    });
  },
  submitMetaData: function (e) {
    let self = this
    $(this.parent.queryByHook("project-meta-data-container")).collapse('hide')
    let data = {"meta-data":this.metaData,"creators":this.creators}
    let queryString = "?path="+this.path+"&projectPath="+this.parent.projectPath
    let endpoint = path.join(app.getApiPath(), "project/export-combine")+queryString
    xhr({uri:endpoint, json:true, method:"post", body:data}, function (err, response, body) {
      if(response.statusCode < 400) {
        if(self.download) {
          let downloadEP = path.join(app.getBasePath(), "/files", body.file_path);
          window.open(downloadEP)
        }else{
          let modal = $(modals.projectExportSuccessHtml(body.file_type, body.message)).modal()
        }
      }else{
        let modal = $(modals.projectExportErrorHtml(body.Reason, body.Message)).modal()
      }
    })
  },
  subviews: {
    inputGivenName: {
      hook: 'given-name-input-view',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'gvien-name',
          label: 'Given Name: ',
          tests: null,
          modelKey: null,
          valueType: 'string',
          value: this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator]["fname"],
        });
      },
    },
    inputFamilyName: {
      hook: 'family-name-input-view',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'family-name',
          label: 'Family Name: ',
          tests: null,
          modelKey: null,
          valueType: 'string',
          value: this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator]["lname"],
        });
      },
    },
    inputEmailName: {
      hook: 'email-input-view',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          placeholder: 'e-mail required',
          name: 'email',
          label: 'e-Mail: ',
          tests: null,
          modelKey: null,
          valueType: 'string',
          value: this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator]["email"],
        });
      },
    },
    inputOrganizationName: {
      hook: 'organization-input-view',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'organization',
          label: 'Organization: ',
          tests: null,
          modelKey: null,
          valueType: 'string',
          value: this.selectedCreator === "New Creator" ? "" : this.creators[this.selectedCreator]["organization"],
        });
      },
    },
  }
});