var $ = require('jquery');
var View = require('ampersand-view');
var ParameterView = require('./parameter');
var PaginatedCollectionView = require('../forms/paginated-collection-view');

var ParameterCollectionFormView = View.extend({
    template: "<div><div data-hook='parametersTable'></div></div>",
    render: function()
    {
        var collectionTemplate = "<div> \
  <h3>Parameters</h3> \
  <table class='table table-bordered' data-hook='table'> \
    <thead> \
      <th width='120px'>Name</th><th width='120px'>Value</th> \
    </thead> \
    <tbody data-hook='items'> \
    </tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button> \
    [ <span data-hook='leftPosition'></span> - <span data-hook='rightPosition'></span> of <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button> \
  </div> \
</div>";

        View.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ParameterView,
            parent : this,
            limit : 10
        }), this.queryByHook('parametersTable'));
        
        return this;
    }
});

module.exports = ParameterCollectionFormView
