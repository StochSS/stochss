// parameter Collection - parameter-collection.js
var Collection = require('./collection');
var parameter = require('./parameter');


module.exports = Collection.extend({
    model: parameter,
    addParameter: function(name, value, skipSetUpValidation) {
        var unique = this.models.every(function(model) { return model["name"] != name });

        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        var parameter = this.add({ name : name, value : value });

        if(!skipSetUpValidation)
            parameter.setUpValidation();

        return parameter;
    }
});