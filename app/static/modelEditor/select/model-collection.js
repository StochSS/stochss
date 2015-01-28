var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');
var InputView = require('ampersand-input-view');
var ModelSelectView = require('./model');
var Model = require('../models/model');

var Tests = require('../forms/tests.js');
var AddNewModelForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var model = new Model({ name : obj.name,
                                units : obj.units,
                                type : 'massaction',
                                isSpatial : true,
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
                options: [['concentration', 'Concentration'], ['population', 'Population']],
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
    template: "<div><h3>Select Model</h3><table class='table table-bordered'><thead><th></th><th>Name</th><th>Type</th><th>Delete</th></thead><tbody data-hook='modelTable'></tbody></table><h3>Add Model</h3><form data-hook='addModelForm'></form></div>",
    props: {
        selected : 'object'
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.meshCollection = attr.meshCollection;

        this.selected = this.collection.at(0);
    },
    selectModel: function(model)
    {
        this.selected = model;
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ModelSelectView, this.el.querySelector('[data-hook=modelTable]'));

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
        this.addForm = new AddNewModelForm(
            {
                el : this.el.querySelector('[data-hook=addModelForm]'),
                meshCollection : this.meshCollection,
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
