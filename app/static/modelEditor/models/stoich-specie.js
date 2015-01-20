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
        
        // Whenever we pick a new species, let the species collection know
        this.on('add remove change:specie', _.bind(function() {
            this.specie.collection.trigger('stoich-specie-change');
        }, this) );
    }
});

module.exports = StoichSpecie;
