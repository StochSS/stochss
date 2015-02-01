var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingSelectView = require('./modifying-select-view');
var ModifyingNumberInputView = require('./modifying-number-input-view')

var Tests = require('./tests');
module.exports = View.extend({
    template: "<tr><td data-hook='delete'></td><td data-hook='specie'></td><td data-hook='stoichiometry'></td></tr>",
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function(element)
    {
        if(element.valid)
            this.model[element.name] = element.value;
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        var button = $( '<button>x</button>' ).appendTo( $( this.el ).find('[data-hook="delete"]') );

        //StoichSpecie -- StoichSpecieCollection -- Reaction -- ReactionCollection -- Model
        this.baseModel = this.model.collection.parent.collection.parent;

        button.click( _.bind(_.partial( this.model.collection.remove, this.model ), this.model.collection) );

        this.renderSubview(
            new ModifyingSelectView({
                template: '<span><span data-hook="label"></span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Species',
                name: 'specie',
                value: this.model.specie,
                options: this.baseModel.species,
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='specie']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Stoichiometry',
                name: 'stoichiometry',
                value: this.model.stoichiometry,
                required: false,
                placeholder: 'Stoichiometry',
                model : this.model,
                tests: [].concat(Tests.nonzero(), Tests.integer())
            }), this.el.querySelector("[data-hook='stoichiometry']"));
        
        //Hide all the labels!
        $( this.el ).find('[data-hook="label"]').hide();
        $( this.el ).find('input, select').css('width', '100px');
        
        return this;
    }
});
