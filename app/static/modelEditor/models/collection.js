var AmpCollection = require('ampersand-collection');

module.exports = AmpCollection.extend({
    remove: function(model)
    {
        model.stopListening();

        AmpCollection.prototype.remove.apply(this, arguments);
    }
});

