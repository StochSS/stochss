var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingSelectView = require('./modifying-select-view');
var ModifyingNumberInputView = require('./modifying-number-input-view')

var Tests = require('./tests');
module.exports = View.extend({
    template: "<tr><td><button data-hook='plus'>+</button></td><td><div data-hook='stoichiometry'></div></td><td><button data-hook='minus'>-</button></td><td data-hook='specie'></td><td><button data-hook='delete'>x</button></td></tr>",
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function(element)
    {
        if(element.valid)
            this.model[element.name] = element.value;
    },
    initialize: function()
    {
        View.prototype.initialize.apply(this, arguments);
        this.showCustomOverride = this.parent.showCustomOverride;

        this.reaction = this.model.collection.parent;

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
        massAction :
        {
            deps : ['reactionType'],
            fn : function() { return this.reactionType != 'custom'; }
        },
        showCustom :
        {
            deps : ['reactionType'],
            fn : function() { return this.showCustomOverride || (this.reactionType == 'massaction' || this.reactionType == 'custom'); }
        }
    },
    bindings : {
        "model.stoichiometry" : {
            type : 'text',
            hook : 'stoichiometry'
        },
        "showCustom" : {
            type : 'toggle',
            selector : 'button'
        }
    },        
    events : {
        "click [data-hook='delete']" : "deleteModel",
        "click [data-hook='plus']" : "addOne",
        "click [data-hook='minus']" : "subtractOne"
    },
    deleteModel : function()
    {
        this.model.collection.remove(this.model);
    },
    addOne : function()
    {
        this.model.stoichiometry = this.model.stoichiometry + 1;
    },
    subtractOne : function()
    {
        if(this.model.stoichiometry >= 2)
            this.model.stoichiometry = this.model.stoichiometry - 1;
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        //StoichSpecie -- StoichSpecieCollection -- Reaction -- ReactionCollection -- Model
        this.baseModel = this.model.collection.parent.collection.parent;

        this.renderSubview(
            new ModifyingSelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'specie',
                value: this.model.specie,
                options: this.baseModel.species,
                unselectedText: 'Pick a specie',
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='specie']"));
        
        return this;
    }
});
