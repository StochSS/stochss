/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let katex = require('katex');
let _ = require('underscore');
//support files
let app = require('../../app');
let modals = require('../../modals');
let tests = require('../../views/tests');
let ReactionTypes = require('../../reaction-types');
//collections
let StoichSpecies = require('../../models/stoich-species');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
let RestrictToView = require('./reaction-restrict-to');
let ReactantProductView = require('./reactant-product');
//templates
let viewTemplate = require('../templates/viewReaction.pug');
let editTemplate = require('../templates/editReaction.pug');

module.exports = View.extend({
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'input-name-container'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        katex.render(this.model.summary, this.queryByHook('summary'), {
          displayMode: true,
          output: 'html',
          maxSize: 5
        });
      },
      hook: 'summary'
    },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    },
    'model.hasConflict': {
      type: function (el, value, previousValue) {
        if(value) {
          $(this.queryByHook('conflicting-modes-message')).collapse('show');
        }else{
          $(this.queryByHook('conflicting-modes-message')).collapse('hide');
        }
      },
      hook: 'conflicting-modes-message'
    },
    'model.mirrorPropensities': {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'mirror-propensities'
    }
  },
  events: {
    'click [data-hook=select]'  : 'selectReaction',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]'  : 'removeReaction',
    'click [data-hook=mirror-propensities]' : 'setMirrorPropensities',
    'change [data-hook=select-rate-parameter]' : 'selectRateParam',
    'change [data-hook=propensity-input]' : 'handlePropensityChange',
    'change [data-hook=select-reaction-type]' : 'selectReactionType'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode) {
      this.rate = this.model.reactionType === "custom-propensity" ? this.model.propensity : this.model.rate.name;
      this.types = [];
      let self = this;
      if(this.model.types) {
        this.model.types.forEach(function (index) {
          let type = self.model.collection.parent.domain.types.get(index, "typeID");
          self.types.push(type.name);
        });
      }
    }else{
      this.model.on('change', _.bind(this.updateViewer, this));
      this.model.on('change-reaction', () => {
        if(this.model.massaction) {
          this.renderODEPropensityInputView({override: true});
          this.renderPropensityInputView({override: true});
        }
      });
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openReactionDetails, this), 1);
      }
      if(!this.model.annotation){
        $(this.queryByHook('edit-annotation-btn')).text('Add');
      }
    }
    app.documentSetup();
  },
  buildStoichSpecies: function (newSpecs, oldSpecs) {
    let specIDs = [];
    newSpecs.forEach((stoichSpecies) => {
      let index = newSpecs.indexOf(stoichSpecies);
      if(oldSpecs.at(index)) {
        stoichSpecies.specie = oldSpecs.at(index).specie;
      }else{
        stoichSpecies.specie = this.getSpecies(specIDs);
      }
      specIDs.push(stoichSpecies.specie.compID);
    });
    return newSpecs;
  },
  editAnnotation: function () {
    if(document.querySelector('#reactionAnnotationModal')) {
      document.querySelector('#reactionAnnotationModal').remove();
    }
    let self = this;
    let name = this.model.name;
    let annotation = this.model.annotation;
    let modal = $(modals.annotationModalHtml("reaction", name, annotation)).modal();
    let okBtn = document.querySelector('#reactionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#reactionAnnotationModal #reactionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      self.model.annotation = input.value.trim();
      self.parent.renderEditReactionView();
    });
  },
  getReactionTypes: function () {
    let disableTypes = this.model.collection.parent.parameters.length == 0;
    let options = _.map(ReactionTypes, function (val, key) {
      let disabled = disableTypes && key !== "custom-propensity"
      return [key, val.label, disabled];
    });
    return options
  },
  getSpecies: function (speciesIDs) {
    let species = this.model.collection.parent.species.filter((spec) => {
      return !speciesIDs.includes(spec.compID);
    });
    if(species.length > 0) { return species[0]; }
    return this.model.collection.parent.species.at(0);
  },
  handlePropensityChange: function () {
    if(this.model.mirrorPropensities) {
      this.model.odePropensity = this.model.propensity;
      this.renderODEPropensityInputView({override: true});
    }
  },
  openReactionDetails: function () {
    $("#collapse-reaction-details" + this.model.compID).collapse("show");
    this.renderDetailsSection();
  },
  removeReaction: function (e) {
    this.collection.removeReaction(this.model);
    this.parent.collection.trigger("change");
  },
  renderDetailsSection: function () {
    this.renderRateSelectView();
    this.renderPropensityInputView();
    this.renderODEPropensityInputView();
    this.renderReactionTypesSelectView();
    this.toggleCustomReactionError();
    this.renderReactantsView();
    this.renderProductsView();
    if(this.model.collection.parent.is_spatial) {
      this.renderRestrictToView()
    }
  },
  renderODEPropensityInputView: function ({override=false}={}) {
    if(override && this.odePropensityInputView) {
      this.odePropensityInputView.remove();
    }

    if(!this.odePropensityInputView || override) {
      if(this.model.massaction) {
        var required = false;
        var propensity = this.model.maODEPropensity
        var modelKey = 'maODEPropensity'
        $(this.queryByHook('mirror-propensities')).prop('disabled', true);
      }else{
        var required = !this.model.mirrorPropensities;
        var propensity = this.model.odePropensity
        var modelKey = 'odePropensity'
      }
      
      this.odePropensityInputView = new InputView({
        parent: this,
        required: required,
        disabled: this.model.massaction || this.model.mirrorPropensities,
        name: 'ode-propensity',
        modelKey: modelKey,
        valueType: 'string',
        value: propensity,
        placeholder: "--No Expression Entered--"
      });
      app.registerRenderSubview(this, this.odePropensityInputView, 'ode-propensity-input');
    }
  },
  renderProductsView: function ({override=false}={}) {
    if(override && this.productsView) {
      this.productsView.remove();
    }

    if(!this.productsView || override) {
      this.productsView = new ReactantProductView({
        collection: this.model.products,
        species: this.model.collection.parent.species,
        reactionType: this.model.reactionType,
        isReactants: false
      });
      app.registerRenderSubview(this, this.productsView, 'products-editor');
    }
  },
  renderPropensityInputView: function ({override=false}={}) {
    if(override && this.propensityInputView) {
      this.propensityInputView.remove();
    }

    if(!this.propensityInputView || override) {
      if(this.model.massaction) {
        var required = false;
        var propensity = this.model.maPropensity
        var modelKey = 'maPropensity'
      }else{
        var required = !this.model.odePropensity;
        var propensity = this.model.propensity
        var modelKey = 'propensity'
      }
      
      this.propensityInputView = new InputView({
        parent: this,
        required: required,
        disabled: this.model.massaction,
        name: 'propensity',
        modelKey: modelKey,
        valueType: 'string',
        value: propensity,
        placeholder: "--No Expression Entered--"
      });
      app.registerRenderSubview(this, this.propensityInputView, 'propensity-input');
    }
  },
  renderRateSelectView: function ({override=false}={}) {
    if(override && this.rateParameterView) {
      this.rateParameterView.remove();
    }

    if(!this.rateParameterView || override) {
      let propensity = this.model.reactionType === 'custom-propensity';
      viewOptions = {
        name: 'rate',
        required: !propensity,
        idAttribute: 'compID',
        textAttribute: 'name',
        eagerValidate: !propensity
      }
      if(propensity) {
        viewOptions['options'] = [];
        viewOptions['unselectedText'] = "N/A";
      }else{
        // make sure the reaction has a rate and that rate exists in the parameters collection
        let paramIDs = this.model.collection.parent.parameters.map(function (param) {
          return param.compID;
        });
        if(!this.model.rate.compID || !paramIDs.includes(this.model.rate.compID)) {
          this.model.rate = this.model.collection.getDefaultRate();
        }
        viewOptions['options'] = this.model.collection.parent.parameters;
        viewOptions['value'] = this.model.rate.compID;
      }

      this.rateParameterView = new SelectView(viewOptions);
      app.registerRenderSubview(this, this.rateParameterView, 'select-rate-parameter');
      $(this.queryByHook('select-rate-parameter').firstChild.children[1]).prop('disabled', propensity);
    }
  },
  renderReactantsView: function ({override=false}={}) {
    if(override && this.reactantsView) {
      this.reactantsView.remove();
    }

    if(!this.reactantsView || override) {
      this.reactantsView = new ReactantProductView({
        collection: this.model.reactants,
        species: this.model.collection.parent.species,
        reactionType: this.model.reactionType,
        isReactants: true
      });
      app.registerRenderSubview(this, this.reactantsView, 'reactants-editor');
    }
  },
  renderReactionTypes: function () {
    let options = {
      displayMode: true,
      output: 'html'
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['0'], options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['1'], options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['2'], options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['3'], options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['4'], options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['5'], options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['6'], options);
  },
  renderReactionTypesSelectView: function ({override=false}={}) {
    if(override && this.reactionTypesSelectView) {
      this.reactionTypesSelectView.remove();
    }

    if(!this.reactionTypesSelectView || override) {
      let options = this.getReactionTypes();
      
      this.reactionTypesSelectView = new SelectView({
        label: 'Reaction Type:',
        name: 'reaction-type',
        required: true,
        idAttribute: 'cid',
        options: options,
        value: this.model.reactionType
      });
      app.registerRenderSubview(this, this.reactionTypesSelectView, 'select-reaction-type');
      this.renderReactionTypes();
    }
  },
  renderRestrictToView: function ({override=true}={}) {
    if(override && this.restrictToView) {
      this.restrictToView.remove();
    }

    if(!this.restrictToView || override) {
      this.restrictToView = new RestrictToView({
        model: this.model,
        parent: this
      });
      app.registerRenderSubview(this, this.restrictToView, 'domain-types-editor');
    }
  },
  selectRateParam: function (e) {
    let val = e.target.selectedOptions.item(0).value;
    let param = this.model.collection.parent.parameters.get(val, 'compID');
    if(param) {
      this.model.rate = param;
      this.updateViewer();
      this.model.trigger('change-reaction');
      this.model.collection.trigger("change");
    }
  },
  selectReaction: function (e) {
    this.model.selected = !this.model.selected;
    this.renderDetailsSection();
  },
  selectReactionType: function (e) {
    let oldReactionType = this.model.reactionType;
    let newReactionType = e.target.selectedOptions.item(0).value;
    if(newReactionType === 'custom-propensity') {
      this.model.reactionType = newReactionType;
      this.model.massaction = false;
    }else if(newReactionType === 'custom-massaction') {
      if(oldReactionType === 'custom-propensity') {
        this.switchCustoms();
      }else{
        this.model.reactionType = newReactionType;
      }
    }else{
      this.switchToFormula(newReactionType);
    }
    this.model.trigger('change-reaction');
    if(newReactionType === 'custom-propensity' || oldReactionType === 'custom-propensity') {
      this.renderRateSelectView({override: true});
      this.renderPropensityInputView({override: true});
      this.renderODEPropensityInputView({override: true});
    }
    this.renderReactantsView({override: true});
    this.renderProductsView({override: true});
  },
  setMirrorPropensities: function () {
    this.model.mirrorPropensities = !this.model.mirrorPropensities;
    if(this.model.mirrorPropensities) {
      this.prevODEProp = this.model.odePropensity;
      this.model.odePropensity = this.model.propensity;
    }else{
      this.model.odePropensity = Boolean(this.prevODEProp) ? this.prevODEProp : ""
    }
    this.renderODEPropensityInputView({override: true});
  },
  switchCustoms: function () {
    let reactants = new StoichSpecies([]);
    reactants.parent = this.model;
    var totalRatio = 0;
    this.model.reactants.forEach((stoichSpecies) => {
      if(totalRatio < 2) {
        let ratio = totalRatio + stoichSpecies.ratio > 2 ? 2 - totalRatio : stoichSpecies.ratio;
        reactants.addStoichSpecie(stoichSpecies.specie.name, {ratio: ratio});
        totalRatio += ratio;
      }
    });
    this.model.reactionType = 'custom-massaction';
    this.model.massaction = true;
    this.model.reactants = reactants;
    if(!this.model.rate.compID) {
      this.model.rate = this.model.collection.getDefaultRate();
    }
  },
  switchToFormula: function (reactionType) {
    let formula = ReactionTypes[reactionType];
    let reactants = this.buildStoichSpecies(
      (new StoichSpecies(formula.reactants)), this.model.reactants
    );
    reactants.parent = this.model;
    let products = this.buildStoichSpecies(
      (new StoichSpecies(formula.products)), this.model.products
    );
    products.parent = this.model;
    this.model.reactionType = reactionType;
    this.model.massaction = true;
    this.model.reactants = reactants;
    this.model.products = products;
    if(!this.model.rate.compID) {
      this.model.rate = this.model.collection.getDefaultRate();
    }
  },
  toggleCustomReactionError: function () {
    let errorMsg = $(this.queryByHook("custom-reaction-error"));
    if(this.model.reactants.length <= 0 && this.model.products.length <= 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function (event) {
    if(!event || !("selected" in event._changed)){
      this.parent.renderViewReactionView();
    }
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      }
    }
  }
});