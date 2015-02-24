var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ParameterFormView = require('./parameter');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('./tests');
var AddNewParameterForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var i = this.collection.models.length;
        var name = 'k' + i;
        var names = this.collection.map( function(parameter) { return parameter.name; } );
        while(_.contains(names, name))
        {
            i += 1;
            name = 'k' + i;
        }

        this.selectView.select(this.collection.addParameter(name, "0"), true);
   },
            // this valid callback gets called (if it exists)
            // when the form first loads and any time the form
            // changes from valid to invalid or vice versa.
            // You might use this to disable the "submit" button
            // any time the form is invalid, for exmaple.
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;
        this.selectView = attr.selectView;

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.button = $('<button class="btn btn-large btn-primary" type="submit">Add Parameter</button>').appendTo( $( this.el ) );
    }
});

var ParameterCollectionFormView = AmpersandView.extend({
    template: "<div> \
  <div data-hook='collection'></div> \
  <br /> \
  <form data-hook='addParametersForm'></form> \
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
        this.parent.update();
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        collectionTemplate = "<div> \
  <table width='100%' data-hook='table'> \
    <thead> \
      <th width='120px'>Name</th><th width='120px'>Value</th><th></th> \
    </thead> \
    <tbody data-hook='items'> \
    </tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button>\
    [ <span data-hook='leftPosition'></span> - <span data-hook='rightPosition'></span> of <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
  </div> \
</div>";

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ParameterFormView,
            parent : this,
            limit : 10
        }), this.queryByHook('collection'));

        this.addForm = new AddNewParameterForm(
            { 
                el : this.el.querySelector('[data-hook=addParametersForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ParameterCollectionFormView