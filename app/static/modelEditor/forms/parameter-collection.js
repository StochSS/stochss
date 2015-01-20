var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ParameterFormView = require('./parameter');

var Tests = require('./tests');
var AddNewParameterForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        this.collection.addParameter(obj.name, obj.value);

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
                required: true,
                placeholder: 'NewParameters',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new InputView({
                label: 'Value',
                name: 'value',
                value: '0',
                required: true,
                placeholder: '0',
                tests: []
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

var ParameterCollectionFormView = AmpersandView.extend({
    template: "<div><h4>Parameters editor</h4><table class='table table-bordered'><thead><th></th><th>Name</th><th>Value</th></thead><tbody data-hook='parametersTable'></tbody></table>Add Parameter: <form data-hook='addParametersForm'></form></div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ParameterFormView, this.el.querySelector('[data-hook=parametersTable]'));

        this.addForm = new AddNewParameterForm(
            { 
                el : this.el.querySelector('[data-hook=addParametersForm]')
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ParameterCollectionFormView