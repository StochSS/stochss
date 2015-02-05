var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view')
var ModifyingNumberInputView = require('./modifying-number-input-view')
var StoichSpecieCollectionFormView = require('./stoich-specie-collection');
var SubdomainFormView = require('./subdomain');
var SelectView = require('ampersand-select-view');

var katex = require('katex')

var Tests = require('./tests');
module.exports = View.extend({
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    template : "<tbody>\
  <tr data-hook='basic'>\
    <td><button data-hook='remove'>x</button></td>\
    <td><span data-hook='name'></span></td> \
    <td><span data-hook='latex'></span></td> \
    <td><input type='radio' name='reaction' data-hook='radio'></td>\
  </tr>\
</tbody>",
    // On any change of anything, redraw the Latex
    redrawLatex: function(obj)
    {
        var latexString = '';

        var numReactants = this.model.reactants.models.length;
        if(numReactants == 0)
        {
            latexString = '\\emptyset';
        } else {
            for(var i = 0; i < numReactants; i++)
            {
                var stoichSpecie = this.model.reactants.models[i]; 
                latexString += stoichSpecie.stoichiometry + stoichSpecie.specie.name;
                
                if(i < numReactants - 1)
                    latexString += ' + ';
            }
        }
            
        latexString += ' \\rightarrow ';

        var numProducts = this.model.products.models.length;
        if(numProducts == 0)
        {
            latexString += '\\emptyset';
        } else {
            for(var i = 0; i < numProducts; i++)
            {
                var stoichSpecie = this.model.products.models[i]; 
                latexString += stoichSpecie.stoichiometry + stoichSpecie.specie.name;
                
                if(i < numProducts - 1)
                    latexString += ' + ';
            }
        }

        katex.render(latexString, this.queryByHook('latex'));
    },
    //Start the removal process... Eventually events will cause this.remove to get called. We don't have to do it explicitly though
    removeModel: function()
    {
        this.model.collection.remove(this.model);        
    },
    // These two functions are a little weird. The first calls the parent select function
    //  But by design the parent is a paginatedCollectionView
    //  Which calls select on the model selected... So calling selectMe gets select called too
    selectMe : function()
    {
        this.parent.parent.select(this.model);
    },
    select : function()
    {
        $( this.el ).find( "[data-hook='radio']" ).prop('checked', true);
    },
    events: {
        "click [data-hook='remove']" : "removeModel",
        "click [data-hook='radio']" : "selectMe"
    },
    render: function()
    {
        this.baseModel = this.model.collection.parent;

        View.prototype.render.apply(this, arguments);

        this.listenTo(this.model, 'change', _.bind(this.redrawLatex, this));
        this.listenTo(this.model.reactants, 'add remove change', _.bind(this.redrawLatex, this));
        this.listenToAndRun(this.model.products, 'add remove change', _.bind(this.redrawLatex, this));

        this.renderSubview(
            new ModifyingInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));
        
        return this;
    }
});
