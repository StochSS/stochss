// parameter Collection - parameter-collection.js
var AmpCollection = require('ampersand-collection');
var parameter = require('./parameter');


module.exports = AmpCollection.extend({
    model: parameter,
    addParameter: function(name, value) {
        var unique = this.models.every(function(model) { return model["name"] != name });

        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        return this.add({ name : name, value : value });
    }
});