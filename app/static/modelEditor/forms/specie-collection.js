var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SpecieFormView = require('./specie');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('./tests');
var AddNewSpecieForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        var model;
        if(this.baseModel.isSpatial)
        {
            model = this.collection.addSpecie(obj.name, 0, Number(obj.diffusion), validSubdomains);
        }
        else
        {
            model = this.collection.addSpecie(obj.name, Number(obj.initialCondition), 0, validSubdomains);
        }

        this.selectView.select(model);

        $( this.nameField.el ).find('input').val('');

        if(this.diffusionField)
            $( this.diffusionField.el ).find('input').val(0);

        if(this.initialConditionField)
            $( this.initialConditionField ).find('input').val(0);
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

        this.selectView = attr.selectView;
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

        this.nameField = this.fields[0];

        if(this.baseModel.isSpatial)
        {
            this.diffusionField = new InputView({
                label: 'Diffusion',
                name: 'diffusion',
                value: '0',
                required: true,
                placeholder: '0',
                tests: [].concat(Tests.positive())
            });

            this.fields.push(this.diffusionField);
        }
        else
        {
            this.initialConditionField = new InputView({
                label: 'Initial Condition',
                name: 'initialCondition',
                value: '0',
                required: true,
                placeholder: '0',
                tests: [].concat(Tests.nonzero(), Tests.units(this.collection.parent))
            });

            this.fields.push(this.initialConditionField);
        }
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<button class="btn btn-primary" type="submit">Add</button>').appendTo( $( this.el ) );
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
    template: "<div> \
  <div data-hook='collection'></div> \
  Add Specie: <form data-hook='addSpeciesForm'></form> \
</div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        var collectionTemplate = "<div> \
  <table data-hook='table'> \
    <thead> \
<th width='25px'></th><th width='120px'>Name</th><th width='120px'>Diffusion coefficients</th>" + ((this.collection.parent.isSpatial) ? "<th width='120px'>Species allowed in these subdomains</th>" : "") + " \
    </thead> \
    <tbody data-hook='items'> \
    </tbody> \
  </table> \
  <button class='btn' data-hook='previous'>&lt;&lt;</button> \
  [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
  <button class='btn' data-hook='next'>&gt;&gt;</button> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            view : SpecieFormView,
            limit : 10
        }), this.queryByHook('collection'));

        this.addForm = new AddNewSpecieForm(
            { 
                el : this.el.querySelector('[data-hook=addSpeciesForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = SpecieCollectionFormView