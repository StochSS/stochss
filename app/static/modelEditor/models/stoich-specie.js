var _ = require('underscore');
var State = require('ampersand-state');
var Specie = require('./specie');

var StoichSpecie = State.extend({
    props: {
        stoichiometry : 'number',
        specie : 'object'
    },
    initialize : function(attrs, options) {
        State.prototype.initialize.apply(this, arguments);
        //add remove 
        // Whenever we pick a new species, let the species collection know
        this.on('change:specie', _.bind(function(model) {
            model.specie.collection.trigger('stoich-specie-change');
        }, this) );
    }
});

module.exports = StoichSpecie;
