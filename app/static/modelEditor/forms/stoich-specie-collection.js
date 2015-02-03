var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var StoichSpecieFormView = require('./stoich-specie');
var SelectView = require('ampersand-select-view');

var Tests = require('./tests');
var AddNewStoichSpecieForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        this.collection.addStoichSpecie(obj.specie, 1);
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
        this.baseModel = this.collection.parent.collection.parent;

        this.fields = [
            new SelectView({
                label: 'Species',
                name: 'specie',
                value: this.baseModel.species.models[0],
                options: this.baseModel.species,
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            })];
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<input type="submit" value="Add" />').appendTo( $( this.el ) );
    }
});

var StoichSpecieCollectionFormView = AmpersandView.extend({
    template: "<div><table data-hook='stoichSpecieTable'></table>Add Specie: <form data-hook='addStoichSpecieForm'></form></div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, StoichSpecieFormView, this.el.querySelector('[data-hook=stoichSpecieTable]'));

        this.addForm = new AddNewStoichSpecieForm(
            { 
                el : this.el.querySelector('[data-hook=addStoichSpecieForm]')
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = StoichSpecieCollectionFormView