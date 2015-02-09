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

        var model;

        var rate = this.baseModel.parameters.at(0);
        var s1 = this.baseModel.species.at(0);
        
        var reactants = [];
        var products = [[s1, 1]];

        var i = this.collection.models.length;
        var name = 'R' + i;
        var names = this.collection.map( function(reaction) { return reaction.name; } );
        while(_.contains(names, name))
        {
            i += 1;
            name = 'R' + i;
        }

        model = this.collection.addMassActionReaction(name, 'creation', rate, reactants, products, validSubdomains);
        
        this.selectView.select(model);
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

        var options = [];

        /*var emptyDiv = $( '<div>' );
        katex.render('\\emptyset \\rightarrow A', emptyDiv[0]);
        options.push(['creation', emptyDiv.html()]);
        katex.render('A \\rightarrow \\emptyset', emptyDiv[0]);
        options.push(['destruction', emptyDiv.html()]);
        katex.render('A \\rightarrow B', emptyDiv[0]);
        options.push(['change', emptyDiv.html()]);
        katex.render('A + A \\rightarrow B', emptyDiv[0]);
        options.push(['dimerization', emptyDiv.html()]);
        katex.render('A \\rightarrow B + C', emptyDiv[0]);
        options.push(['split', emptyDiv.html()]);
        katex.render('A + B \\rightarrow C + D', emptyDiv[0]);
        options.push(['four', emptyDiv.html()]);
        options.push(['massaction', 'Mass action, custom stoichiometry']);
        options.push(['custom', 'Custom propensity, custom stoichiometry']);

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

        this.button = $('<button class="btn btn-primary" type="submit">Add Reaction</button>').appendTo( $( this.el ) );
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
      <th width='25px'></th><th width='120px'>Name</th><th>Summary</th><th width='25px'>Edit</th>\
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
