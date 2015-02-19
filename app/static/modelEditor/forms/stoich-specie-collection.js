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
                template: '<span><select></select></span>',
                label: '',
                name: 'specie',
                unselectedText: 'Add species',
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

        this.button = $('<button type="submit">Add</button>').appendTo( $( this.el ) );
    }
});

var StoichSpecieCollectionFormView = AmpersandView.extend({
    template: "<table height='100%'>\
<tr><td valign='top'>\
<table data-hook='stoichSpecieTable'></table>\
</td><tr/>\
<tr><td valign='bottom'>\
<div data-hook='addStoichSpecieDiv'>\
<form data-hook='addStoichSpecieForm'>\
</form>\
</div>\
</td></tr>\
</table>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.reaction = this.collection.parent;

        this.listenToAndRun(this.reaction, 'change:type', _.bind(this.setReactionType, this));
    },
    setReactionType: function()
    {
        this.reactionType = this.reaction.type;
    },
    props:
    {
        reactionType : 'string',
        showCustomOverride : 'boolean'
    },
    derived: {
        showCustom :
        {
            deps : ['reactionType'],
            fn : function() {
                return this.showCustomOverride || (this.reactionType == 'custom' || this.reactionType == 'massaction');
            }
        }
    },
    bindings : {
        "showCustom" : {
            type : 'toggle',
            hook : 'addStoichSpecieDiv'
        }
    },        
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, StoichSpecieFormView, this.el.querySelector('[data-hook=stoichSpecieTable]'), { showCustomOverride : this.showCustomOverride } );

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
