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
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Domain = require('../models/domain');
//views
let View = require('ampersand-view');
let SpeciesView = require('../views/species-view');
let DomainViewer = require('../views/domain-viewer');
let ParametersView = require('../views/parameters-view');
let InitialConditionsView = require('../views/initial-conditions-view');
//templates
let template = require('../templates/includes/modelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=all-continuous]' : 'setDefaultMode',
    'change [data-hook=all-discrete]' : 'setDefaultMode',
    'change [data-hook=advanced]' : 'setDefaultMode'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : true;
    let modeMap = {continuous: "Concentration", discrete: "Population", dynamic: "Hybrid Concentration/Population"};
    this.modelMode = modeMap[this.model.defaultMode]
  },
  render: function(attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      this.setReadOnlyMode("model-mode");
    }else {
      if(this.model.defaultMode === "" && !this.model.is_spatial){
        this.getInitialDefaultMode();
      }else {
        let dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
        $(this.queryByHook(dataHooks[this.model.defaultMode])).prop('checked', true);
        if(this.model.is_spatial) {
          $(this.queryByHook("advanced-model-mode")).css("display", "none");
        }
      }
    }
    if(this.model.is_spatial) {
      this.renderDomainViewer();
    }
  },
  getInitialDefaultMode: function () {
    let self = this;
    if(document.querySelector('#defaultModeModal')) {
      document.querySelector('#defaultModeModal').remove();
    }
    let modal = $(modals.renderDefaultModeModalHtml()).modal();
    let continuous = document.querySelector('#defaultModeModal .concentration-btn');
    let discrete = document.querySelector('#defaultModeModal .population-btn');
    let dynamic = document.querySelector('#defaultModeModal .hybrid-btn');
    continuous.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "continuous");
    });
    discrete.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "discrete");
    });
    dynamic.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "dynamic");
    });
  },
  renderDomainViewer: function(domainPath=null) {
    if(this.domainViewer) {
      this.domainViewer.remove();
    }
    if(domainPath && domainPath !== "viewing") {
      let self = this;
      let queryStr = "?path=" + this.model.directory + "&domain_path=" + domainPath;
      let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr;
      app.getXHR(endpoint, {
        always: function (err, response, body) {
          let domain = new Domain(body.domain);
          self.domainViewer = new DomainViewer({
            parent: self,
            model: domain,
            domainPath: domainPath,
            readOnly: self.readOnly
          });
          app.registerRenderSubview(self, self.domainViewer, 'domain-viewer-container');
        }
      });
    }else{
      this.domainViewer = new DomainViewer({
        parent: this,
        model: this.model.domain,
        domainPath: domainPath,
        readOnly: this.readOnly
      });
      app.registerRenderSubview(this, this.domainViewer, 'domain-viewer-container');
    }
  },
  setAllSpeciesModes: function (prevMode) {
    let self = this;
    this.model.species.forEach(function (specie) { 
      specie.mode = self.model.defaultMode;
      self.model.species.trigger('update-species', specie.compID, specie, false, true);
    });
    let switchToDynamic = (!Boolean(prevMode) || prevMode !== "dynamic") && this.model.defaultMode === "dynamic";
    let switchFromDynamic = Boolean(prevMode) && prevMode === "dynamic" && this.model.defaultMode !== "dynamic";
    if(switchToDynamic || switchFromDynamic) {
      this.speciesView.renderEditSpeciesView();
      this.speciesView.renderViewSpeciesView();
    }
  },
  setDefaultMode: function (e) {
    let prevMode = this.model.defaultMode;
    this.model.defaultMode = e.target.dataset.name;
    this.speciesView.defaultMode = e.target.dataset.name;
    this.setAllSpeciesModes(prevMode);
    this.parent.toggleVolumeContainer();
  },
  setInitialDefaultMode: function (modal, mode) {
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
    modal.modal('hide');
    $(this.queryByHook(dataHooks[mode])).prop('checked', true);
    this.model.defaultMode = mode;
    this.speciesView.defaultMode = mode;
    this.setAllSpeciesModes();
    this.parent.toggleVolumeContainer();
  },
  setReadOnlyMode: function (component) {
    $(this.queryByHook(component + '-edit-tab')).addClass("disabled");
    $(".nav .disabled>a").on("click", function(e) {
      e.preventDefault();
      return false;
    });
    $(this.queryByHook(component + '-view-tab')).tab('show');
    $(this.queryByHook('edit-' + component)).removeClass('active');
    $(this.queryByHook('view-' + component)).addClass('active');
  },
  subviews: {
    speciesView: {
      hook: "species-view-container",
      prepareView: function (el) {
        return new SpeciesView({
          collection: this.model.species,
          spatial: this.model.is_spatial,
          defaultMode: this.model.defaultMode,
          readOnly: this.readOnly
        });
      }
    },
    initialConditionsView: {
      waitFor: "model.is_spatial",
      hook: "initial-conditions-view-container",
      prepareView: function (el) {
        return new InitialConditionsView({
          collection: this.model.initialConditions,
          readOnly: this.readOnly
        });
      }
    },
    parametersView: {
      hook: "parameters-view-container",
      prepareView: function (el) {
        return new ParametersView({
          collection: this.model.parameters,
          readOnly: this.readOnly
        });
      }
    }
  }
});