var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');
var InputView = require('ampersand-input-view');
var ModelSelectView = require('./model');
var Model = require('../models/model');
var CheckboxView = require('ampersand-checkbox-view');
var PaginatedCollectionView = require('../forms/paginated-collection-view');

var Tests = require('../forms/tests.js');
var AddNewModelForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var units = $( obj.toElement ).attr( 'data-hook' );
        var isSpatial = false;

        if(units == 'spatial')
        {
            units = 'population'
            isSpatial = true;
        }

        var i = this.collection.models.length;
        var name = 'model' + i;
        var names = this.collection.map( function(specie) { return specie.name; } );
        while(_.contains(names, name))
        {
            i += 1;
            name = 'model' + i;
        }

        var model = new Model({ name : name,
                                units : units,
                                type : 'massaction',
                                isSpatial : isSpatial,
                                mesh : this.meshCollection.at(0) });

        this.collection.add(model).save();

        this.selectView.select(model, true);
    },
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    initialize: function(attr, options) {
        this.collection = attr.collection;
        this.meshCollection = attr.meshCollection;
        this.selectView = attr.selectView;
    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.buttonTemplate = '<div class="btn-group"> \
  <a class="btn btn-large btn-primary dropdown-toggle" data-toggle="dropdown" href="#"> \
    Add Model \
    <span class="caret"></span> \
  </a> \
  <ul class="dropdown-menu"> \
    <li><a data-hook="concentration" tabindex="-1" href="#">Concentration, Well-mixed</a></li> \
    <li><a data-hook="population" tabindex="-1" href="#">Population, Well-mixed</a></li> \
    <li><a data-hook="spatial" tabindex="-1" href="#">Population, Spatial</a></li> \
  </ul> \
</div>';

        this.button = $( this.buttonTemplate ).appendTo( $( this.el ) );

        $( this.el ).find( 'li a' ).click( _.bind(this.submitCallback, this));
    }
});

var ModelCollectionSelectView = AmpersandView.extend({
    template: "<div> \
  <div data-hook='modelCollection'></div> \
  <br /> \
  <form data-hook='addModelForm'></form> \
</div>",
    props: {
        selected : 'object',
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.meshCollection = attr.meshCollection;
    },
    select: function(model)
    {
        if(model instanceof Model)
        {
            this.selectView.select(model);
        }
        else
        {
            this.selected = this.selectView.value;
        }
    },
    render: function()
    {
        var collectionTemplate = "<div> \
  <table data-hook='table' class='table table-bordered'> \
    <thead> \
      <th width='25px'></th><th width='170px'>Name</th><th>Properties</th><th width='25px'>Delete</th> \
    </thead> \
    <tbody data-hook='items'></tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn btn-link' data-hook='previous'>&lt;&lt;</button> \
    [ <span data-hook='position'></span> / <span data-hook='total'></span> ] \
    <button class='btn btn-link' data-hook='next'>&gt;&gt;</button> \
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview(new PaginatedCollectionView({
            template : collectionTemplate,
            collection : this.collection,
            viewModel : ModelSelectView,
            limit : 10,
            value : this.selected,
            autoSelect : false
        }), this.queryByHook('modelCollection'));

        this.listenToAndRun(this.selectView, 'change:value', _.bind(this.select, this));

        //this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
        this.addForm = new AddNewModelForm(
            {
                el : this.el.querySelector('[data-hook=addModelForm]'),
                selectView : this.selectView,
                meshCollection : this.meshCollection,
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ModelCollectionSelectView
