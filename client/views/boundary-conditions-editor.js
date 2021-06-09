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
let path = require('path');
//support files
let app = require('../app');
let tests = require('./tests');
let Tooltips = require('../tooltips');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let BoundaryConditionView = require('./boundary-condition-view');
//templates
let template = require('../templates/includes/boundaryConditionsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=new-bc-name]' : 'handleSetValue',
    'change [data-hook=new-bc-target]' : 'handleSetTarget',
    'change [data-hook=new-bc-deterministic]' : 'handleSetDeterministic',
    'change [data-hook=new-bc-type]' : 'handleSetValue',
    'change [data-hook=new-bc-value]' : 'handleSetValue',
    'change [data-hook=new-bc-x-min]' : 'handleSetValue',
    'change [data-hook=new-bc-x-max]' : 'handleSetValue',
    'change [data-hook=new-bc-y-min]' : 'handleSetValue',
    'change [data-hook=new-bc-y-max]' : 'handleSetValue',
    'change [data-hook=new-bc-z-min]' : 'handleSetValue',
    'change [data-hook=new-bc-z-max]' : 'handleSetValue',
    'click [data-hook=collapse-bc]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-new-bc' : 'changeCollapseButtonText',
    'click [data-hook=add-new-bc]' : 'handleAddBCClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.boundaryConditionsEditor;
    this.setDefaultBC();
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('bc-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('bc-view-tab')).tab('show');
      $(this.queryByHook('edit-boundary-conditions')).removeClass('active');
      $(this.queryByHook('view-boundary-conditions')).addClass('active');
    }else{
      this.renderEditBoundaryConditionView();
      this.toggleAddNewBCButton();
    }
    this.renderViewBoundaryConditionView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  handleAddBCClick: function (e) {
    let endpoint = path.join(app.getApiPath(), "model/new-bc")
    let self = this;
    app.postXHR(endpoint, this.newBC, {
      success: function (err, response, body) {
        self.collection.addNewBoundaryCondition(self.newBCName, body.expression);
        self.setDefaultBC();
        self.resetNewBCViews();
      }
    });
  },
  handleSetDeterministic: function (e) {
    this.newBC.deterministic = e.target.checked;
  },
  handleSetTarget: function (e) {
    let properties = ["v", "nu", "rho"];
    let target = e.target.value;
    if(properties.includes(target)) {
      this.newBC.property = target;
      this.newBC.species = null;
      $(this.queryByHook("new-bc-deterministic")).prop("disabled", true);
    }else{
      this.newBC.property = null;
      this.newBC.species = target;
      $(this.queryByHook("new-bc-deterministic")).prop("disabled", false);
    }
  },
  handleSetValue: function (e) {
    let key = e.delegateTarget.dataset.target;
    let value = e.target.value;
    if(key === "name") {
      this.newBCName = value;
    }else{
      if(key.endsWith("min") || key.endsWith("max") || key === "type_id"){
        value = this.validateNewBCCondition(key, value);
      }else if(key === "value" && value === "") {
        value = null;
      }
      this.newBC[key] = value;
    }
    this.toggleAddNewBCButton();
  },
  renderEditBoundaryConditionView: function () {
    if(this.editBoundaryConditionView) {
      this.editBoundaryConditionView.remove();
    }
    this.editBoundaryConditionView = this.renderCollection(
      this.collection,
      BoundaryConditionView,
      this.queryByHook("edit-boundary-conditions-list")
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderViewBoundaryConditionView: function () {
    if(this.viewBoundaryConditionView) {
      this.viewBoundaryConditionView.remove();
    }
    let options = {viewOptions: {viewMode: true}};
    this.viewBoundaryConditionView = this.renderCollection(
      this.collection,
      BoundaryConditionView,
      this.queryByHook("view-boundary-conditions-list"),
      options
    );
  },
  resetNewBCViews: function () {
    $(this.queryByHook("new-bc-deterministic")).prop("checked", this.newBC.deterministic);
    $(this.queryByHook("new-bc-name")).find("input").val(this.newBCName);
    $(this.queryByHook("new-bc-target")).find("select").val(this.newBC.property);
    $(this.queryByHook("new-bc-type")).find("input").val(this.newBC.type_id);
    $(this.queryByHook("new-bc-value")).find("input").val(this.newBC.value);
    $(this.queryByHook("new-bc-x-min")).find("input").val(this.newBC.xmin);
    $(this.queryByHook("new-bc-x-max")).find("input").val(this.newBC.xmax);
    $(this.queryByHook("new-bc-y-min")).find("input").val(this.newBC.ymin);
    $(this.queryByHook("new-bc-y-max")).find("input").val(this.newBC.ymax);
    $(this.queryByHook("new-bc-z-min")).find("input").val(this.newBC.zmin);
    $(this.queryByHook("new-bc-z-max")).find("input").val(this.newBC.zmax);
    $(this.queryByHook("new-bc-deterministic")).prop("disabled", true);
    this.toggleAddNewBCButton();
  },
  setDefaultBC: function () {
    this.newBCName = "";
    this.newBC = {"species": null, "property": "v", "value": null, "deterministic": true, "type_id": null,
                  "xmin": null, "ymin": null, "zmin": null, "xmax": null, "ymax": null, "zmax": null};
    this.setConditions = [];
  },
  toggleAddNewBCButton: function () {
    let disabled = this.newBCName === "" || this.newBC.value === null || !this.setConditions.length;
    $(this.queryByHook("add-new-bc")).prop("disabled", disabled);
  },
  update: function (e) {},
  validateNewBCCondition: function(key, value) {
    if((value === 0 && key === "type_id") || value === "") {
      value = null
      if(this.setConditions.includes(key)){
        let index = this.setConditions.indexOf(key);
        this.setConditions.splice(index, 1);
      }
    }else if(!this.setConditions.includes(key)){
      this.setConditions.push(key);
    }
    return value;
  },
  subviews: {
    newBCName: {
      hook: "new-bc-name",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'name',
          valueType: 'string',
          value: this.newBCName
        });
      }
    },
    newBCTarget: {
      hook: "new-bc-target",
      prepareView: function (el) {
        let species = this.collection.parent.species.map(function (specie) {
          return [specie.compID, specie.name]
        });
        let properties = [["v", "Velocity"], ["nu", "Viscosity"], ["rho", "Density"]]
        let options = [{groupName: "Properties", options: properties},
                       {groupName: "Variables", options: species}]
        return new SelectView({
          parent: this,
          required: false,
          name: 'target',
          eagerValidate: true,
          groupOptions: options,
          value: this.newBC.property
        });
      }
    },
    newBCValue: {
      hook: "new-bc-value",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'value',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.value
        });
      }
    },
    newBCxmin: {
      hook: "new-bc-x-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xmin',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.xmin,
        });
      }
    },
    newBCymin: {
      hook: "new-bc-y-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'ymin',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.ymin,
        });
      }
    },
    newBCzmin: {
      hook: "new-bc-z-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'zmin',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.zmin,
        });
      }
    },
    newBCxmax: {
      hook: "new-bc-x-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xmax',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.xmax,
        });
      }
    },
    newBCymax: {
      hook: "new-bc-y-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'ymax',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.ymax,
        });
      }
    },
    newBCzmax: {
      hook: "new-bc-z-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'zmax',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.zmax,
        });
      }
    },
    newBCType: {
      hook: "new-bc-type",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'type',
          tests: tests.valueTests,
          valueType: 'number',
          value: this.newBC.type_id,
        });
      }
    }
  }
});