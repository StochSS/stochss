var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SpecieFormView = require('./specie');

var Tests = require('./tests');
var AddNewSpecieForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        this.collection.addSpecie(obj.name, Number(obj.initialCondition));

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
                placeholder: 'NewSpecies',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new InputView({
                label: 'Initial Condition',
                name: 'initialCondition',
                value: '0',
                required: true,
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

/*var TestForm = AmpersandFormView.extend({
    initialize: function(attr, options) {
        console.log('1');
    },
    render: function()
    {
        console.log('2');
    }
});

new TestForm();*/

var SpecieCollectionFormView = AmpersandView.extend({
    template: "<div><h4>Species editor</h4><table><thead><th></th><th>Name</th><th>Initial Condition</th></thead><tbody data-hook='speciesTable'></tbody></table>Add Specie: <form data-hook='addSpeciesForm'></form></div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        //new TestForm();

        this.renderCollection(this.collection, SpecieFormView, this.el.querySelector('[data-hook=speciesTable]'));

        this.addForm = new AddNewSpecieForm(
            { 
                el : this.el.querySelector('[data-hook=addSpeciesForm]')
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = SpecieCollectionFormView