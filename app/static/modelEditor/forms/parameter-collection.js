var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ParameterFormView = require('./parameter');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('./tests');
var AddNewParameterForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        this.selectView.select(this.collection.addParameter(obj.name, obj.value));

        $( this.nameField.el ).find('input').val('');

        $( this.valueField.el ).find('input').val(0); 
   },
            // this valid callback gets called (if it exists)
            // when the form first loads and any time the form
            // changes from valid to invalid or vice versa.
            // You might use this to disable the "submit" button
            // any time the form is invalid, for exmaple.
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;
        this.selectView = attr.selectView;

        this.nameField = new InputView({
            label: 'Name',
            name: 'name',
            value: '',
            required: true,
            placeholder: 'NewParameters',
            tests: [].concat(Tests.naming(this.collection))
        });
        
        this.valueField = new InputView({
            label: 'Value',
            name: 'value',
            value: '0',
            required: true,
            placeholder: '0',
            tests: []
        });


        this.fields = [
            this.nameField,
            this.valueField
        ];
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<button class="btn btn-primary" type="submit">Add</button>').appendTo( $( this.el ) );
    }
});

var ParameterCollectionFormView = AmpersandView.extend({
    template: "<div> \
  <div data-hook='collection'></div> \
  Add Parameter: <form data-hook='addParametersForm'></form> \
</div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        collectionTemplate = "<div> \
  <table data-hook='table'> \
    <thead> \
      <th width='25px'></th><th width='120px'>Name</th><th width='120px'>Value</th> \
    </thead> \
    <tbody data-hook='items'> \
    </tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button>\
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
  </div> \
</div>";

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ParameterFormView,
            limit : 10
        }), this.queryByHook('collection'));

        this.addForm = new AddNewParameterForm(
            { 
                el : this.el.querySelector('[data-hook=addParametersForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ParameterCollectionFormView