var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ReactionFormView = require('../forms/reaction');

var katex = require('katex')

var ReactionView = View.extend({
    template: "<tr><td data-hook='name'></td><td data-hook='parameter'></td><td data-hook='equation'></td><td data-hook='latex'></td><td data-hook='result'></td></tr>",
    volumeChange: function(obj)
    {
        var factor = ReactionView.computeConversionFactor(this.model, this.baseView.volume);

        var result = $( this.queryByHook('result') );

        var name = 'X';

        if(this.model.rate)
            if(this.model.rate.name)
                name = this.model.rate.name;

        if(this.model.type != 'massaction' && this.model.type != 'custom')
        {
            if(typeof(factor) != 'undefined')
            {
                katex.render((name + factor).replace(/_/g, '\\_'), this.queryByHook('parameter'));
                result.text('Successfully converted');
            } else {
                katex.render(name.replace(/_/g, '\\_'), this.queryByHook('parameter'));                    
                result.text('Failed, valid mass action, but invalid under SSA assumptions');
            }
        }
        else if(this.model.type == 'massaction')
        {
            if(typeof(factor) != 'undefined')
            {
                katex.render((name + factor).replace(/_/g, '\\_'), this.queryByHook('parameter'));
                result.text('Successfully converted');
            } else {
                katex.render(name.replace(/_/g, '\\_'), this.queryByHook('parameter'));                    
                result.text('Failed, valid mass action, but invalid under SSA assumptions');
            }
        }
        else
        {
            result.text('Cannot convert custom propensities automatically');

            $( this.queryByHook('equation') ).text( this.model.equation );
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
        'modelType' : [
            {
                type: 'switch',
                cases: {
                    'notCustom' : '[data-hook="parameter"]',
                    'custom' : '[data-hook="equation"]'
                }
            }
        ]
    },
    derived: {
        'modelType' : {
            deps : ['model.type'],
            fn : function() { 
                if(this.model.type == 'custom')
                {
                    return 'custom';
                } else {
                    return 'notCustom';
                }
            }
        }
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
    
    if(reaction.type != 'custom')
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
