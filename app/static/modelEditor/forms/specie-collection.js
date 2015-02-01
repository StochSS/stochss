var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SpecieFormView = require('./specie');

var Tests = require('./tests');
var AddNewSpecieForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        if(this.baseModel.isSpatial)
        {
            this.collection.addSpecie(obj.name, 0, Number(obj.diffusion), validSubdomains);
        }
        else
        {
            this.collection.addSpecie(obj.name, Number(obj.initialCondition), 0, validSubdomains);
        }

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

        this.baseModel = this.collection.parent;

        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: true,
                placeholder: 'NewSpecies',
                tests: [].concat(Tests.naming(this.collection))
            })
        ];

        if(this.baseModel.isSpatial)
        {
            this.fields.push(new InputView({
                label: 'Diffusion',
                name: 'diffusion',
                value: '0',
                required: true,
                placeholder: '0',
                tests: [].concat(Tests.positive())
            }));
        }
        else
        {
            this.fields.push(new InputView({
                label: 'Initial Condition',
                name: 'initialCondition',
                value: '0',
                required: true,
                placeholder: '0',
                tests: [].concat(Tests.nonzero(), Tests.units(this.collection.parent))
            }));
        }
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
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.listenToAndRun(this.collection, 'add remove change', _.bind(this.updateHasModels, this))
    },
    props : {
        hasModels : 'boolean'
    },
    bindings : {
        'hasModels' : {
            type : 'toggle',
            hook : 'speciesTable'
        }
    },
    updateHasModels: function()
    {
        this.hasModels = this.collection.models.length > 0;
    },
    render: function()
    {
        if(this.collection.parent.isSpatial)
        {
            this.template = "<div><h4>Species editor</h4><table data-hook='speciesTable'><thead><th></th><th>Name</th><th>Diffusion</th><th>Subdomains</th></thead><tbody data-hook='speciesTBody'></tbody></table>Add Specie: <form data-hook='addSpeciesForm'></form></div>";
        }
        else
        {
            this.template = "<div><h4>Species editor</h4><table><thead><th></th><th>Name</th><th>Initial Condition</th></thead><tbody data-hook='speciesTBody'></tbody></table>Add Specie: <form data-hook='addSpeciesForm'></form></div>";
        }

        AmpersandView.prototype.render.apply(this, arguments);

        //new TestForm();

        this.renderCollection(this.collection, SpecieFormView, this.el.querySelector('[data-hook=speciesTBody]'));

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