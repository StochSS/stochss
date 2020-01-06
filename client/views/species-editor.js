var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditNonspatialSpecieView = require('./edit-specie');
var EditSpatialSpecieView = require('./edit-spatial-specie');
var EditAdvancedSpecie = require('./edit-advanced-specie');
//templates
var nonspatialSpecieTemplate = require('../templates/includes/speciesEditor.pug');
var spatialSpecieTemplate = require('../templates/includes/spatialSpeciesEditor.pug');

let renderDefaultModeModalHtml = () => {
  return `
    <div id="defaultModeModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content default-species">
          <div class="modal-header">
            <h5 class="modal-title">Default Species Mode</h5>
            <button type="button" class="close close-modal" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <input type="radio" id="continuous" name="default-mode" data-name="continuous"> Continuous
            </div>
            <div>
              <input type="radio" id="discrete" name="default-mode" data-name="discrete"> Discrete
            </div>
            <div>
              <input type="radio" id="dynamic" name="default-mode" data-name="dynamic"> Dynamic
            </div>
            <div>
              <input type="radio" id="automatic" name="default-mode" data-name="automatic"> Let Us Choose For You
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary ok-model-btn" disabled>OK</button>
          </div>
        </div>
      </div>
    </div>
  `
}

module.exports = View.extend({
  events: {
    'change [data-hook=all-continuous]' : 'getDefaultSpeciesMode',
    'change [data-hook=all-discrete]' : 'getDefaultSpeciesMode',
    'change [data-hook=advanced]' : 'getDefaultSpeciesMode',
    'change [data-hook=automatic]' : 'getDefaultSpeciesMode',
    'click [data-hook=add-species]' : 'addSpecies',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.collection.parent;
  },
  render: function () {
    this.template = this.parent.model.is_spatial ? spatialSpecieTemplate : nonspatialSpecieTemplate;
    View.prototype.render.apply(this, arguments);
    if(this.collection.parent.defaultMode === ""){
      this.getInitialDefaultSpeciesMode();
    }
    var editSpecieView = !this.collection.parent.is_spatial ? EditNonspatialSpecieView : EditSpatialSpecieView;
    this.renderCollection(this.collection, editSpecieView, this.queryByHook('specie-list'));
    this.renderSpeciesAdvancedView() 
  },
  update: function () {
  },
  updateValid: function (e) {
    console.log("checked")
  },
  getInitialDefaultSpeciesMode: function () {
    var self = this;
    if(document.querySelector('#defaultModeModal')) {
      document.querySelector('#defaultModeModal').remove()
    }
    let modal = $(renderDefaultModeModalHtml()).modal();
    let okBtn = document.querySelector('#defaultModeModal .ok-model-btn');
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced', 'automatic':'automatic'}
    $(document).on('change', 'input:radio[name="default-mode"]', function (event) {
      var disabled = document.querySelector('#defaultModeModal .ok-model-btn').disabled
      if(disabled){
        document.querySelector('#defaultModeModal .ok-model-btn').disabled = false;
      }
    });
    okBtn.addEventListener('click', function (e) {
      var defaultMode = $('input[name=default-mode]:checked')[0].dataset.name
      modal.modal('hide')
      $(self.queryByHook(dataHooks[defaultMode])).prop('checked', true)
      self.setAllSpeciesModes(defaultMode)
    });
  },
  getDefaultSpeciesMode: function (e) {
    this.setAllSpeciesModes(e.target.dataset.name)
  },
  setAllSpeciesModes: function (defaultMode) {
    this.collection.parent.defaultMode = defaultMode;
    if(defaultMode !== 'automatic'){
      this.collection.map(function (specie) { specie.mode = defaultMode})
    }
    if(defaultMode === "dynamic"){
      this.renderSpeciesAdvancedView()
      $(this.queryByHook('advanced-species')).collapse('show');
    }
    else{
      $(this.queryByHook('advanced-species')).collapse('hide');
    }
  },
  renderSpeciesAdvancedView: function () {
    if(this.speciesAdvancedView) {
      this.speciesAdvancedView.remove()
    }
    this.speciesAdvancedView = this.renderCollection(this.collection, EditAdvancedSpecie, this.queryByHook('edit-species-mode'));
  },
  addSpecies: function () {
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains.map(function (model) {return model.name; });
    this.collection.addSpecie(subdomains);
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});