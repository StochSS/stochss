var _ = require('underscore');
var State = require('ampersand-state');

module.exports = State.extend({
    props: {
        type : 'string',
        specie : 'object',
        count : 'string',
        subdomain : 'object',
        X : 'number',
        Y : 'number',
        Z : 'number'
    }
});

