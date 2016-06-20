var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var InitialConditionFormView = require('./initial-condition');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('./tests');
var AddNewInitialConditionForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        if(this.baseModel.species.models.length > 0)
        {
            var model = this.collection.addScatterInitialCondition(this.baseModel.species.at(0), 0, this.baseModel.mesh.uniqueSubdomains.at(0).name);
        
            this.selectView.select(model, true);
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;

        this.selectView = attr.selectView;
        this.baseModel = this.collection.parent;
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.button = $('<button class="btn btn-large btn-primary" type="submit">Add Initial Condition</button>').appendTo( $( this.el ) );
    }
});

var InitialConditionCollectionFormView = AmpersandView.extend({
    template : "<div>\
  <div data-hook='initialConditionCollection'></div> \
  <br />\
  <form data-hook='addInitialConditionForm'></form>\
</div>",
    props : {
        valid : 'boolean',
        message : 'string'
    },
    updateValid : function()
    {
        if(this.selectView)
        {
            this.selectView.updateValid();
            
            this.valid = this.selectView.valid;
            this.message = this.selectView.message;
        }
        else
        {
            this.valid = true;
            this.message = '';
        }
    },
    update : function()
    {
        this.updateValid();

        if(this.parent && this.parent.update)
            this.parent.update();
    },
    render: function()
    {
        this.baseModel = this.collection.parent;

        var collectionTemplate = "<div> \
  <table data-hook='table' class='table'>\
    <thead>\
      <th></th><th>Type</th><th>Species</th><th>Details</th>\
    </thead>\
    <tbody data-hook='items'> \
    </tbody> \
  </table>\
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button> \
    [ <span data-hook='position'></span> / <span data-hook='total'></span> of <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button> \
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : InitialConditionFormView,
            parent : this,
            limit : 10
        }), this.queryByHook('initialConditionCollection'));

        this.addForm = new AddNewInitialConditionForm(
            { 
                el : this.el.querySelector('[data-hook=addInitialConditionForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );

        //this.addForm.render();

        this.listenTo(this.collection, "remove", _.bind(this.update, this));

        return this;
    }
});

module.exports = InitialConditionCollectionFormView
