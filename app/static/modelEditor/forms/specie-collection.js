var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SpecieFormView = require('./specie');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('./tests');
var AddNewSpecieForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        var i = this.collection.models.length;
        var name = 'S' + i;
        var names = this.collection.map( function(specie) { return specie.name; } );
        while(_.contains(names, name))
        {
            i += 1;
            name = 'S' + i;
        }

        var model = this.collection.addSpecie(name, 0, 0, validSubdomains);

        this.selectView.select(model, true);
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

        this.baseModel = this.collection.parent;

        this.selectView = attr.selectView;
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<button class="btn btn-large btn-primary" type="submit">Add Species</button>').appendTo( $( this.el ) );
    }
});

/*var TestForm = AmpersandFormView.extend({
    initialize: function(attr, options) {
        console.log('1');
    },
    render: function()
    {
        console.log('2');
    }
});

new TestForm();*/

var SpecieCollectionFormView = AmpersandView.extend({
    template: "<div> \
  <div data-hook='collection'></div> \
  <br /> \
  <form data-hook='addSpeciesForm'></form> \
</div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        var collectionTemplate = "<div> \
  <table width='100%' data-hook='table'> \
    <thead> \
<th width='120px'>Name</th><th width='120px'>" + ((this.collection.parent.isSpatial) ? "Diffusion coefficient" : "Initial Condition") + "</th>" + ((this.collection.parent.isSpatial) ? "<th width='120px'>Species allowed in these subdomains</th>" : "") + "<th></th> \
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

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : SpecieFormView,
            limit : 10
        }), this.queryByHook('collection'));

        this.addForm = new AddNewSpecieForm(
            { 
                el : this.el.querySelector('[data-hook=addSpeciesForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = SpecieCollectionFormView