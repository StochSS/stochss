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
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
