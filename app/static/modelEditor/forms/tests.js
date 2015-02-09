var _ = require('underscore');

module.exports = {
    naming : function(collection, thisModel) {
        return [
            function(value) {
                if(value != '' && /^[0-9][a-zA-Z0-9_]*$/.test(value))
                    return "Cannot start with number";
            },
            function(value) {
                if(value != '' && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value))
                    return "Letters, numbers, underscores only";
            },
            function(value) {
                if(collection) {
                    if(!collection.every(_.bind(function(model) {
                        return model.name != value || model == thisModel;
                    }, this)))
                        return "Name must be unique";
                }
            }
        ];
    },
    isNumber : function()
    {
        return function(value) {
            if(!(value < 0 || value > 0 || value == 0))
            {
                return "Entry must be a number";
            }
        }
    },
    positive : function()
    {
        return function(value) {
            if(value < 0)
            {
                return "Number must be positive";
            }
        }
    },
    nonzero : function() {
        return function(value) {
            if(value < 0.0)
            {
                return "Number must be greater than 0";
            }
        }
    },
    units : function(model) {
        return function(value) {
            if(model && model.units == 'population')
            {
                if(value % 1 != 0)
                {
                    return "Initial condition must be integer";
                }
            }
        }
    },
    integer : function() {
        return function(value) {
            if(value % 1 != 0)
            {
                return "Must be integer";
            }
        }
    }
};