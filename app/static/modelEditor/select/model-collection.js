var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');
var InputView = require('ampersand-input-view');
var ModelSelectView = require('./model');
var Model = require('../models/model');
var CheckboxView = require('ampersand-checkbox-view');

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

        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: true,
                placeholder: 'NewModel',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new SelectView({
                label: 'Units',
                name: 'units',
                value: 'population',
                options: [['concentration', 'Concentration'], ['population', 'Population'], ['spatialPopulation', 'Spatial Population']],
                required: true,
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
    template: $( '.modelSelectorTemplate' ).text(),
    props: {
        selected : 'object',
        hasModels : 'boolean'
    },
    bindings : {
        'hasModels' : {
            type : 'toggle',
            hook : 'modelTable'
        }
    },
    updateHasModels: function()
    {
        this.hasModels = this.collection.models.length > 0;
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.meshCollection = attr.meshCollection;

        this.selected = this.collection.at(0);

        if(attr.noAdd)
            this.noAdd = attr.noAdd;
        else
            this.noAdd = false;

        this.listenToAndRun(this.collection, 'add remove change', _.bind(this.updateHasModels, this))
    },
    selectModel: function(model)
    {
        this.selected = model;
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ModelSelectView, this.el.querySelector('[data-hook=modelTBody]'));

        $( '[data-hook="duplicateLink"]' ).click( _.bind( function() {
            this.selected.trigger('duplicateLink');
        }, this ) );
        $( '[data-hook="convertToPopulationLink"]' ).click( _.bind( function() {
            this.selected.trigger('convertToPopulationLink');
        }, this ) );
        $( '[data-hook="convertToSpatialLink"]' ).click( _.bind( function() {
            this.selected.trigger('convertToSpatialLink');
        }, this ) );

        // Select the currently selected model
        var inputs = $( this.el ).find('input');
        for(var i = 0; i < inputs.length; i++)
        {
            if(this.selected == this.collection.models[i])
            {
                $( inputs.get(i) ).prop('checked', true);
            }
        }

        //this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
        if(!this.noAdd)
        {
            this.addForm = new AddNewModelForm(
                {
                    el : this.el.querySelector('[data-hook=addModelForm]'),
                    meshCollection : this.meshCollection,
                    collection : this.collection
                }
            );
        }
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
