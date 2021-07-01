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
//support files
let modals = require('../modals');
//views
let View = require('ampersand-view');
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
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
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
  setDefaultMode: function (e) {
    let prevMode = this.model.defaultMode;
    this.model.defaultMode = e.target.dataset.name;
    this.parent.speciesEditor.defaultMode = e.target.dataset.name;
    this.parent.setAllSpeciesModes(prevMode);
    this.parent.toggleVolumeContainer();
  },
  setInitialDefaultMode: function (modal, mode) {
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
    modal.modal('hide');
    $(this.queryByHook(dataHooks[mode])).prop('checked', true);
    this.model.defaultMode = mode;
    this.parent.speciesEditor.defaultMode = mode;
    this.parent.setAllSpeciesModes();
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
  }
});