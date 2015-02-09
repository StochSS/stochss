var $ = require('jquery');
var View = require('ampersand-view');
var SpecieView = require('./specie');
var PaginatedCollectionView = require('../forms/paginated-collection-view');

var SpecieCollectionView = View.extend({
    template: "<div><div data-hook='speciesTable'></div></div>",
    render: function()
    {
        var collectionTemplate = "<div> \
  <h3>Species</h3> \
  <table class='table table-bordered' data-hook='table'> \
    <thead> \
      <th width='120px'>Name</th><th width='120px'>Initial Condition</th> \
    </thead> \
    <tbody data-hook='items'> \
    </tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button> \
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button> \
  </div> \
</div>";

        View.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : SpecieView,
            parent : this,
            limit : 10
        }), this.queryByHook('speciesTable'));

        return this;
    }
});

module.exports = SpecieCollectionView