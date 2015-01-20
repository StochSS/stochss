var $ = require('jquery');
var View = require('ampersand-view');
var SpecieView = require('./specie');

var SpecieCollectionView = View.extend({
    template: "<div><div>Species editor<div><table data-hook='speciesTable'></table></div>",
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, SpecieView, this.el.querySelector('[data-hook=speciesTable]'));
        
        return this;
    }
});

module.exports = SpecieCollectionView