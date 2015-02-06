var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ReactionFormView = require('../forms/reaction');

var katex = require('katex')

var ReactionView = View.extend({
    template: "<tr><td data-hook='name'></td><td data-hook='typeSelect'></td><td data-hook='parameter'></td><td data-hook='equation'></td><td data-hook='latex'></td><td data-hook='result'></td></tr>",
    volumeChange: function(obj)
    {
        var factor = ReactionView.computeConversionFactor(this.model, this.baseView.volume);

        var result = $( this.queryByHook('result') );

        if(this.model.type == 'massaction')
        {
            if(typeof(factor) != 'undefined')
            {
                katex.render(this.model.rate.name + factor, this.queryByHook('parameter'));
                result.text('Successful');
            } else {
                katex.render(this.model.rate.name, this.queryByHook('parameter'));                    
                result.text('Failed, Valid Mass Action, but Invalid under SSA assumptions');
            }
        } else {
            result.text('Cannot convert custom propensities automatically');
        }
    },
    // On any change of anything, redraw the Latex
    redrawLatex: ReactionFormView.prototype.redrawLatex,
    bindings: {
        'model.name' :
        {
            type: 'text',
            hook: 'name'
        },
        'model.type' : [
            {
                type: 'text',
                hook: 'typeSelect'
            },
            {
                type: 'switch',
                cases: {
                    'massaction' : '[data-hook="parameter"]',
                    'custom' : '[data-hook="equation"]'
                }
            }
        ]
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.baseView = this.parent.parent.parent;

        this.listenToAndRun(this.baseView, 'change:volume', this.volumeChange);

        this.redrawLatex();
        
        return this;
    }
});

ReactionView.computeConversionFactor = function(reaction, volume)
{
    //Count number of reactions
    //The model very well could lie about being mass action, we gotta check
    var reactants = reaction.reactants.models;
    var reactantCount = reactants.length;
    var reactantParticleCount = 0;
    
    var allTheSame = true;
    var last = null;
    for(var j = 0; j < reactants.length; j++) {
        var specie = reactants[j].specie;
        if(last != null && last != specie)
        {
            allTheSame = false;
        }
        
        reactantParticleCount += Number(reactants[j].stoichiometry);
        last = specie;
    }
    
    if(reaction.type == 'massaction')
    {
	if(reactantCount == 0) {
            return ' * ' + volume;
        } else if(reactantCount == 1 && reactantParticleCount == 1) {
            return '';
        } else if((reactantCount == 1 || reactantCount == 2) && reactantParticleCount == 2) {
            if(allTheSame == true && reactantParticleCount == 2) {
                return ' * 2 / ' + volume;
            } else {
                return ' / ' + volume;
            }
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
};

module.exports = ReactionView;