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
    bindings : {
        "model.stoichiometry" : {
            type : 'text',
            hook : 'stoichiometry'
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
                template: '<span><span data-hook="label"></span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'specie',
                value: this.model.specie,
                options: this.baseModel.species,
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='specie']"));
        
        return this;
    }
});
