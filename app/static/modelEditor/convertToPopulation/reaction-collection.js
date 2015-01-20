var $ = require('jquery');
var View = require('ampersand-view');
var ReactionView = require('./reaction');

var ReactionCollectionView = View.extend({
    template: "<div><div>Reactions editor<div><table border='1' data-hook='reactionTable'></table></div>",
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ReactionView, this.el.querySelector('[data-hook=reactionTable]'));
        
        return this;
    }
});

module.exports = ReactionCollectionView