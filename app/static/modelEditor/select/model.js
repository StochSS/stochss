var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var Tests = require('../forms/tests');
var Model = require('../models/model');

//<div>Model type: <div data-hook='type'></div><div data-hook='specie'></div><div data-hook='parameter'></div><div data-hook='reaction'></div><div data-hook='convertToPopulation'></div></div>
//<i class="icon-remove"></i></span>
module.exports = View.extend({
    template: '<tr data-hook="row"> \
  <td> \
    <button data-hook="edit" class="btn-sm btn">Select</button> \
  </td> \
  <td data-hook="name"> \
  </td> \
  <td data-hook="type"> \
  </td> \
  <td> \
    <div class="btn-group"> \
      <button type="button" class="btn btn-default btn-sm" data-hook="delete"> \
        Delete \
      </button> \
      <button type="button" class="btn btn-default btn-sm" data-hook="duplicate"> \
        Duplicate \
      </button> \
      <button type="button" class="btn btn-default btn-sm" data-hook="convert"> \
         \
      </button> \
    </div> \
  </td> \
</tr>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    props : {
        valid : 'boolean',
        message : 'string',
        state : 'string'
    },
    bindings: {
        'invalid' : {
            type : 'booleanClass',
            name : 'invalidRow',
            hook : 'row'
        },
        'textType' : {
            type : 'text',
            hook: 'type'
        }
    },
    derived: {
        textType : {
            deps : ['model.units', 'model.type', 'model.isSpatial'],
            fn : function() {
                var base = '';
                if(this.model.type == 'massaction')
                    base += 'Mass action, ';
                else
                    base += 'Non-mass action, ';

                if(this.model.units == 'concentration')
                {
                    base += 'concentration, non-spatial';
                }
                else if(this.model.isSpatial)
                {
                    base += 'population, spatial';
                }
                else
                {
                    base += 'population, non-spatial';
                }

                return base;
            }
        },
        invalid : {
            deps : ['valid'],
            fn : function() {
                return !this.valid;
            }
        }
    },
    events: {
        "click [data-hook=edit]" : "selectSelf",
        "click [data-hook=delete]" : "removeModel",
        "click [data-hook=duplicate]" : "duplicateModel",
        "click [data-hook=convert]" : "convert"
        //"click [data-hook=convertToPopulation]" : "convertToPopulation",
        //"click [data-hook=convertToSpatial]" : "convertToSpatial"
    },
    updateValid : function()
    {
        this.valid = (!this.nameBox || this.nameBox.valid);
        this.message = '';

        if(this.nameBox && !this.nameBox.valid)
            this.message = 'Model name invalid';
    },
    update : function(obj)
    {
        this.updateValid();

        if(this.parent && this.parent.update)
            this.parent.update();
    },
    selectSelf: function()
    {
        // There is a CollectionView parent here that must be navigated
        this.parent.select(this.model);
    },
    deSelect : function()
    {
        $( this.queryByHook( "edit" ) ).removeClass('btn-success');
        $( this.queryByHook( "name" ) ).find('input').prop('disabled', true);
    },
    select : function()
    {
        $( this.queryByHook( "edit" ) ).addClass('btn-success');
        $( this.queryByHook( "name" ) ).find('input').prop('disabled', false);
    },
    updateVisibility : function() {
        if(this.model.isSpatial)
        {
            //$( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
            //$( this.el ).find( '[data-hook="convertToSpatial"]' ).hide();
            $( this.el ).find( '[data-hook="convert"]' ).remove();
        }
        else if(this.model.units == 'concentration')
        {
	    $( this.el ).find( '[data-hook="convert"]' ).text( 'Convert to Population' );
            //$( this.el ).find( '[data-hook="convertToPopulation"]' ).show();
            //$( this.el ).find( '[data-hook="convertToSpatial"]' ).hide();
            //$( this.el ).find( '[data-hook="dropdown"]' ).prop('disabled', false);
        }
        else if(this.model.units == 'population')
        {
	    $( this.el ).find( '[data-hook="convert"]' ).text( 'Convert to Spatial' );
            //$( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
            //$( this.el ).find( '[data-hook="convertToSpatial"]' ).show();
            //$( this.el ).find( '[data-hook="dropdown"]' ).show('disabled', false);
        }
    },
    removeModel: function()
    {
        if(!confirm("Are you sure you want to delete this model?"))
            return;

        var saveMessageDom = $( '[data-hook="saveMessage"]' );

        //this.model.collection.remove(this.model);
        saveMessageDom.removeClass( "alert-success alert-danger" );
        saveMessageDom.addClass( "alert-info" );
        saveMessageDom.text( "Deleting model..." );

        this.model.destroy({
            success : _.bind(this.modelDeleted, this),
            error : _.bind(this.modelFailedToDelete, this)
        });
    },
    duplicateModel: function()
    {
        var model = new Model(this.model.toJSON());

        var names = this.model.collection.map( function(model) { return model.name; } );

        while(1)
        {
            var tmpName = this.model.name + '_' + Math.random().toString(36).substr(2, 3);

            if(!_.contains(names, tmpName))
            {
                model.name = tmpName;
                break;
            }
        }

        model.id = undefined;
        
        model.setupMesh(this.model.mesh.collection);

        this.model.collection.add(model);

        model.save();
    },
    convert: function(event)
    {
	if(this.model.units == 'concentration')
	    this.convertToPopulation();
	else if(this.model.units == 'population')
	    this.convertToSpatial();
    },
    convertToSpatial: function(event)
    {
        this.selectSelf();

        //Parent.parent.parent is the highest level UI View
        this.parent.parent.parent.modelEditor.convertToSpatial();

	//event.preventDefault();
    },
    convertToPopulation: function(event)
    {
        this.selectSelf();
        
        this.parent.parent.parent.modelEditor.convertToPopulation();

	//event.preventDefault();
    },
    modelDeleted: function()
    {
        var saveMessageDom = $( '[data-hook="saveMessage"]' );

        saveMessageDom.removeClass( "alert-info alert-danger" );
        saveMessageDom.addClass( "alert-success" );
        saveMessageDom.text( "Model deleted" );
    },
    modelFailedToDelete: function()
    {
        var saveMessageDom = $( '[data-hook="saveMessage"]' );

        saveMessageDom.removeClass( "alert-info alert-success" );
        saveMessageDom.addClass( "alert-danger" );
        saveMessageDom.text( "Model not saved to local library!" );
    },
    initialize: function()
    {
        View.prototype.initialize.apply(this, arguments);

        this.updateValid();
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.nameBox = this.renderSubview(
            new ModifyingInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                parent: this,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        var model = this.model;

        this.deSelect();

        this.updateValid();

        this.listenToAndRun(this.model, 'change:units change:isSpatial', _.bind(this.updateVisibility, this));

        return this;
    }
});
