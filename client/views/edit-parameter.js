var tests = require('./tests');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editReactionVar.pug');

let parameterAnnotationModalHtml = (parameterName, annotation) => {
  return `
    <div id="parameterAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${parameterName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="parameterAnnotationInput">Annotation: </span>
            <input type="text" id="parameterAnnotationInput" name="parameterAnnotationInput" size="30" autofocus value="${annotation}">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary ok-model-btn">OK</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeParameter',
    'change [data-hook=input-name-container]' : 'setParameterName',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeParameter: function () {
    this.remove();
    this.collection.removeParameter(this.model);
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#parameterAnnotationModal')) {
      document.querySelector('#parameterAnnotationModal').remove();
    }
    let modal = $(parameterAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#parameterAnnotationModal .ok-model-btn');
    let input = document.querySelector('#parameterAnnotationModal #parameterAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        self.model.annotation = input.value;
      }
      modal.modal('hide');
    });
  },
  setParameterName: function (e) {
    var oldName = this.model.name;
    this.model.name = e.target.value;
    this.model.collection.trigger('update-parameters', oldName, this.model);
    this.model.collection.trigger('remove')
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: '',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'expression',
          label: '',
          tests: '',
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
        });
      },
    },
  },
});