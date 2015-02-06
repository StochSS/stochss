// parameter Collection - parameter-collection.js
var Collection = require('./collection');
var parameter = require('./parameter');


module.exports = Collection.extend({
    model: parameter,
    addParameter: function(name, value) {
        var unique = this.models.every(function(model) { return model["name"] != name });

        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        return this.add({ name : name, value : value });
    }
});