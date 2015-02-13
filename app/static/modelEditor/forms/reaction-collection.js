var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var DetailedReactionFormView = require('./reaction-detail');
var ReactionFormView = require('./reaction');
var SubCollection = require('ampersand-subcollection');
var PaginatedCollectionView = require('./paginated-collection-view');
var katex = require('katex');

var Tests = require('./tests');
var AddNewReactionForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        // I shouldn't extract the type this way probly
        var type = $( obj.toElement ).attr( "data-hook" );

        var model;

        var reactants = 0;
        var products = 0;
        if(type == 'creation')
        {
            reactants = 0;
            products = 1;
        }
        else if(type == 'destruction')
        {
            reactants = 1;
            products = 0;
        }
        if(type == 'change')
        {
            reactants = 1;
            products = 1;
        }
        if(type == 'merge')
        {
            reactants = 2;
            products = 1;
        }
        if(type == 'dimerization')
        {
            reactants = 1;
            products = 1;
        }
        if(type == 'split')
        {
            reactants = 1;
            products = 2;
        }
        if(type == 'four')
        {
            reactants = 2;
            products = 2;
        }

        var modelReactants = []
        var modelProducts = []
        for(var i = 0; i < reactants; i++)
        {
            modelReactants.push([this.baseModel.species.at(i), 1]);
        }
        
        for(var i = 0; i < products; i++)
        {
            modelProducts.push([this.baseModel.species.at(i), 1]);
        }

        if(type == 'dimerization')
            modelReactants[0][1] = 2;
        
        var i = this.collection.models.length;
        var name = 'R' + i;
        var names = this.collection.map( function(reaction) { return reaction.name; } );
        while(_.contains(names, name))
        {
            i += 1;
            name = 'R' + i;
        }

        var rate = this.baseModel.parameters.at(0);

        model = this.collection.addMassActionReaction(name, type, rate, modelReactants, modelProducts, validSubdomains);
        
        this.selectView.select(model, true);

        obj.preventDefault();
    },
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    update: function (obj) {
        AmpersandFormView.prototype.update.apply(this, arguments);
    },
    initialize: function(attr, options) {
        this.collection = options.collection;

        this.selectView = attr.selectView;
        this.baseModel = this.collection.parent;

        /*var options = [];
        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: true,
                placeholder: 'NewReaction',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new SelectView({
                label: 'Type',
                name: 'type',
                value: 'creation',
                options: options,
                required: true,
            })
        ];*/

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.update({ name : 'type', value : 'massaction' });

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.buttonTemplate = '<div class="btn-group"> \
  <a class="btn btn-large btn-primary dropdown-toggle" data-toggle="dropdown" href="#"> \
    Add Reaction \
    <span class="caret"></span> \
  </a> \
  <ul class="dropdown-menu"> \
    <li><a data-hook="creation" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="destruction" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="change" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="dimerization" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="split" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="four" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="massaction" tabindex="-1" href="#">Custom mass action</a></li> \
    <li><a data-hook="custom" tabindex="-1" href="#">Custom propensity</a></li> \
  </ul> \
</div>';

        this.button = $( this.buttonTemplate ).appendTo( $( this.el ) );

        katex.render('\\emptyset \\rightarrow A', $( this.el ).find('[data-hook=creation]')[0]);
        katex.render('A \\rightarrow \\emptyset', $( this.el ).find('[data-hook=destruction]')[0]);
        katex.render('A \\rightarrow B', $( this.el ).find('[data-hook=change]')[0]);
        katex.render('A + A \\rightarrow B', $( this.el ).find('[data-hook=dimerization]')[0]);
        katex.render('A \\rightarrow B + C', $( this.el ).find('[data-hook=split]')[0]);
        katex.render('A + B \\rightarrow C + D', $( this.el ).find('[data-hook=four]')[0]);

        $( this.el ).find( 'li a' ).click( _.bind(this.submitCallback, this));
    }
});

var ReactionCollectionFormView = AmpersandView.extend({
    template: "<div>\
  <div>\
    <div data-hook='collection'></div>\
    <div data-hook='reactionEditorWorkspace'></div>\
  </div> \
  <div style='clear: both;'> \
    <form data-hook='addReactionForm'></form>\
  </div> \
</div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    remove: function()
    {
        //if(model == this.selectView.value)
        this.removeDetailView();

        AmpersandView.prototype.remove.apply(this, arguments);
    },
    handleCollectionRemove: function(model, collection)
    {
        if(model == this.selectView.value)
        {
            this.removeDetailView();
            
            this.selectView.select(this.collection.at(0));
        }
    },
    removeDetailView: function()
    {
        if(typeof(this.detailView) != 'undefined')
        {
            this.detailView.remove();
            delete this.detailView;
        }
    },
    select: function()
    {
        this.removeDetailView();

        var model = this.selectView.value;

        if(model)
        {
            this.detailView = new DetailedReactionFormView({
                el: $( '<div>' ).appendTo( this.queryByHook('reactionEditorWorkspace') )[0],
                model: model,
                parent : this
            });

            this.detailView.render();
        }
    },
    render: function()
    {
        this.baseModel = this.collection.parent;

        var collectionTemplate = '';

        collectionTemplate = "<div>\
  <table data-hook='table'>\
    <thead>\
      <th width='25px'>Edit</th><th width='120px'>Name</th><th>Summary</th><th width='40px'>Delete</th>\
    </thead>\
    <tbody data-hook='items'>\
    </tbody>\
  </table>\
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button>\
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView({
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ReactionFormView,
            limit : 10
        }), this.queryByHook('collection'));

        this.addForm = new AddNewReactionForm(
            { 
                el : this.el.querySelector('[data-hook=addReactionForm]'),
                selectView : this.selectView
            },
            {
                collection : this.collection
            }
        );

        this.listenToAndRun(this.selectView, 'change:value', _.bind(this.select, this));
        this.listenTo(this.collection, 'remove', _.bind(this.handleCollectionRemove, this));
        
        return this;
    }
});

module.exports = ReactionCollectionFormView;
