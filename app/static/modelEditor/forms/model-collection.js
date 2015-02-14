var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ModelSelectView = require('./model-select');

var Tests = require('./tests');
var AddNewModelForm = AmpersandFormView.extend({
    submitCallback: function (obj) {

        this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
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

        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: false,
                placeholder: 'NewModel',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new InputView({
                label: 'Initial Condition',
                name: 'initialCondition',
                value: '0',
                required: false,
                placeholder: '0',
                tests: [].concat(Tests.nonzero(), Tests.units(this.collection.parent))
            })
        ];

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<input type="submit" value="Add" />').appendTo( $( this.el ) );
    }
});

var ModelCollectionSelectView = AmpersandView.extend({
    template: "<div><div>Model selector<div><table data-hook='modelTable'></table>Add Model: <form data-hook='addModelForm'></form></div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ModelSelectView, this.el.querySelector('[data-hook=modelTable]'));

        /*this.addForm = new AddNewModelForm(
            {
                el : this.el.querySelector('[data-hook=addModelForm]')
            },
            {
                collection : this.collection
            }
        );*/
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
