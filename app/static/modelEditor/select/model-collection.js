var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');
var InputView = require('ampersand-input-view');
var ModelSelectView = require('./model');
var Model = require('../models/model');
var CheckboxView = require('ampersand-checkbox-view');
var PaginatedCollectionView = require('../forms/paginated-collection-view');

var Tests = require('../forms/tests.js');
var AddNewModelForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var units = '';
        var isSpatial = false;

        if(obj.units == 'concentration')
        {
            units = obj.units;
        }
        else if(obj.units == 'population')
        {
            units = obj.units
        }
        else
        {
            units = 'population'
            isSpatial = true;
        }   

        var model = new Model({ name : obj.name,
                                units : units,
                                type : 'massaction',
                                isSpatial : isSpatial,
                                mesh : this.meshCollection.at(0) });

        this.collection.add(model).save();

        this.selectView.select(model);

        $( this.nameField.el ).find('input').val('');
    },
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    initialize: function(attr, options) {
        this.collection = attr.collection;
        this.meshCollection = attr.meshCollection;
        this.selectView = attr.selectView;

        this.nameField = new InputView({
            label: 'Name',
            name: 'name',
            value: '',
            required: true,
            placeholder: 'NewModel',
            tests: [].concat(Tests.naming(this.collection))
        });

        this.unitsSelectField = new SelectView({
            label: 'Units',
            name: 'units',
            value: 'population',
            options: [['concentration', 'Concentration'], ['population', 'Population'], ['spatialPopulation', 'Spatial Population']],
            required: true,
        });

        this.fields = [
            this.nameField,
            this.unitsSelectField
        ];
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<button class="btn btn-primary" type="submit">Add Model</button>').appendTo( $( this.el ) );
    }
});

var ModelCollectionSelectView = AmpersandView.extend({
    template: "<div> \
  <div data-hook='modelCollection'></div> \
  <h4>Add Model</h4> \
  <form data-hook='addModelForm'></form> \
</div>",
    props: {
        selected : 'object',
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.meshCollection = attr.meshCollection;
    },
    handleCollectionRemove: function(model, collection)
    {
        if(model == this.selectView.value)
        {
            this.selectView.select(this.collection.at(0));
        }
    },
    select: function()
    {
        this.selected = this.selectView.value;
    },
    render: function()
    {
        var collectionTemplate = "<div> \
  <table data-hook='table' class='table table-bordered'> \
    <thead> \
      <th width='25px'></th><th width='170px'>Name</th><th>Type</th><th width='25px'>Delete</th> \
    </thead> \
    <tbody data-hook='items'></tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button> \
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button> \
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview(new PaginatedCollectionView({
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ModelSelectView,
            limit : 10
        }), this.queryByHook('modelCollection'));

        this.listenToAndRun(this.selectView, 'change:value', _.bind(this.select, this));
        this.listenToAndRun(this.collection, 'remove', _.bind(this.handleCollectionRemove, this));

        //this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
        this.addForm = new AddNewModelForm(
            {
                el : this.el.querySelector('[data-hook=addModelForm]'),
                selectView : this.selectView,
                meshCollection : this.meshCollection,
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
