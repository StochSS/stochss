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

let xhr = require('xhr');
let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
//models
let Project = require('../models/project');
//views
let PageView = require('./base');
//templates
let template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  events: {
  	'change [data-hook=annotation-text-container]' : 'updateAnnotation',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=collapse-annotation-container]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this
    let urlParams = new URLSearchParams(window.location.search)
    this.model = new Project({
      directory: urlParams.get('path')
    });
    this.model.fetch({
      success: function (model, response, options) {
      	$("#page-title").text("Project: " + model.name)
      	if(model.annotation){
      	  $(self.queryByHook('edit-annotation-btn')).text('Edit Notes');
	      $(self.queryByHook('annotation-text-container')).text(model.annotation)
	      $(self.queryByHook("collapse-annotation-container")).collapse('show')
	    }
        // if(response.trash_empty) {
        //   $(self.queryByHook('empty-project-trash')).prop('disabled', true)
        // }
        // self.renderSubviews()
      }
    });
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  handleEditAnnotationClick: function (e) {
  	let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook('collapse-annotation-container')).collapse('show');
      $(this.queryByHook('edit-annotation-btn')).text('Edit Notes');
    }else if(!$("#annotation-text").attr('class').includes('show')){
      $("#annotation-text").collapse('show');
      $(this.queryByHook("collapse-annotation-text")).text('-');
    }
    document.querySelector("#annotation").focus();
  },
  updateAnnotation: function (e) {
    this.model.annotation = e.target.value.trim();
    if(this.model.annotation === ""){
      $(this.queryByHook('edit-annotation-btn')).text('Add Notes');
      $(this.queryByHook("collapse-annotation-container")).collapse('hide');
    }
    let endpoint = path.join(app.getApiPath(), "project/save-annotation")+"?path="+this.model.directory;
    xhr({uri: endpoint, json: true, method: "post", data: {'annotation': this.model.annotation}});
  }
});

initPage(ProjectManager)