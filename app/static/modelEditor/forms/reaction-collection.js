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

        var s1 = this.baseModel.species.at(0);
        var s2 = this.baseModel.species.at(1);

        var rate = this.baseModel.parameters.models[0];

        if(obj.type != 'custom')
        {
            var reactants;
            var products;
            if(obj.type == 'creation')
            {
                reactants = [];
                products = [[s1, 1]];
            }
            else if(obj.type == 'destruction')
            {
                reactants = [[s1, 1]];
                products = [];
            }
            if(obj.type == 'change')
            {
                reactants = [[s1, 1]];
                products = [[s2, 1]];
            }
            if(obj.type == 'dimerization')
            {
                reactants = [[s1, 2]];
                products = [[s2, 1]];
            }
            if(obj.type == 'split')
            {
                reactants = [[s2, 1]];
                products = [[s1, 1], [s1, 1]];
            }
            if(obj.type == 'four')
            {
                reactants = [[s1, 1], [s1, 1]];
                products = [[s1, 1], [s1, 1]];
            }
            model = this.collection.addMassActionReaction(obj.name, obj.type, rate, reactants, products, validSubdomains);
        } else {
            model = this.collection.addCustomReaction(obj.name, '', [], [], validSubdomains);
        }
        
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

        var emptyDiv = $( '<div>' );
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
        ];

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.update({ name : 'type', value : 'massaction' });

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<input type="submit" value="Add"/>').appendTo( $( this.el ) );
    }
});

var ReactionCollectionFormView = AmpersandView.extend({
    template: "<div>\
  <div class='row'> \
    <div class='span4' data-hook='collection'></div>\
    <div class='span7' data-hook='reactionEditorWorkspace'></div>\
  </div> \
  <h4>Add Reaction</h4>\
  <form data-hook='addReactionForm'></form>\
</div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    props: {
        selected : 'object',
    },
    select: function()
    {
        var model = this.selectView.value;

        if(typeof(this.detailView) != 'undefined')
            this.detailView.remove();

        if(model)
        {
            this.detailView = this.renderSubview(new DetailedReactionFormView({
                model : model
            }), $( '<div>' ).appendTo( this.queryByHook('reactionEditorWorkspace') )[0]);
        }
    },
    render: function()
    {
        this.baseModel = this.collection.parent;

        var collectionTemplate = '';

        collectionTemplate = "<div>\
  <table data-hook='table'>\
    <thead>\
      <th></th><th>Name</th><th>Summary</th><th>Edit</th>\
    </thead>\
    <tbody data-hook='items'>\
    </tbody>\
  </table>\
  <div>\
    <button class='btn' data-hook='previous'>&lt;&lt;</button>\
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView({
            template : collectionTemplate,
            collection : this.collection,
            view : ReactionFormView,
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
        
        return this;
    }
});

module.exports = ReactionCollectionFormView;
