var _ = require('underscore');
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
    submitCallback: function (type, obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

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

        this.buttonTemplate = '<div class="btn-group dropup"> \
  <button class="btn btn-large btn-primary dropdown-toggle" data-toggle="dropdown"> \
    Add Reaction \
    <span class="caret"></span> \
  </button> \
  <ul class="dropdown-menu"> \
    <li><a data-hook="creation" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="destruction" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="change" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="dimerization" tabindex="-1" href="#"></a></li> \
    <li><a data-hook="merge" tabindex="-1" href="#"></a></li> \
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
        katex.render('A + B \\rightarrow C', $( this.el ).find('[data-hook=merge]')[0]);
        katex.render('A \\rightarrow B + C', $( this.el ).find('[data-hook=split]')[0]);
        katex.render('A + B \\rightarrow C + D', $( this.el ).find('[data-hook=four]')[0]);

        $( this.el ).find('[data-hook=creation]').click( _.bind(_.partial(this.submitCallback, 'creation'), this));
        $( this.el ).find('[data-hook=destruction]').click( _.bind(_.partial(this.submitCallback, 'destruction'), this));
        $( this.el ).find('[data-hook=change]').click( _.bind(_.partial(this.submitCallback, 'change'), this));
        $( this.el ).find('[data-hook=dimerization]').click( _.bind(_.partial(this.submitCallback, 'dimerization'), this));
        $( this.el ).find('[data-hook=merge]').click( _.bind(_.partial(this.submitCallback, 'merge'), this));
        $( this.el ).find('[data-hook=split]').click( _.bind(_.partial(this.submitCallback, 'split'), this));
        $( this.el ).find('[data-hook=four]').click( _.bind(_.partial(this.submitCallback, 'four'), this));
        $( this.el ).find('[data-hook=massaction]').click( _.bind(_.partial(this.submitCallback, 'massaction'), this));
        $( this.el ).find('[data-hook=custom]').click( _.bind(_.partial(this.submitCallback, 'custom'), this));
    }
});

var ReactionCollectionFormView = AmpersandView.extend({
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
            
            if(!this.selectView.valid)
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
        var intro;
        if(this.collection.parent.isSpatial)
        {
            intro = "Define reactions. Select from the given reaction templates, or use the custom types. Using templated reaction types will help eliminate errors. For non-linear reactions, use the custom propensity type. Reactions can be restricted to specific subdomains.";
        }
        else
        {
            intro = "Define reactions. Select from the given reaction templates, or use the custom types. Using templated reaction types will help eliminate errors. For non-linear reactions, use the custom propensity type.";
        }

        this.template = "<div>" + intro + "\
  <div>\
    <div data-hook='collection'></div>\
    <div data-hook='reactionEditorWorkspace'></div>\
  </div> \
  <div style='clear: both;'> \
    <br /> \
    <form data-hook='addReactionForm'></form>\
  </div> \
</div>";


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
    [ <span data-hook='leftPosition'></span> - <span data-hook='rightPosition'></span> of <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView({
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ReactionFormView,
            parent : this,
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
