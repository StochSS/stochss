var ModelEditor = ModelEditor || {}

ModelEditor.MenuBar = Backbone.View.extend(
    {
        initialize: function()
        {
            if(!_.has(this, 'model'))
            {
                this.model = {};
            }

            this.template = _.template( $( '#menuBarTemplate' ).html() );
        },

        attach: function(model)
        {
            if(!_.isEmpty(this.model))
            {
                this.detach();
            }

            this.listenTo(model, 'change', this.render);
            this.listenTo(model, 'destroy', this.detach);           

            this.model = model;

            this.render();
        },

        detach: function()
        {
            this.stopListening(this.model);

            this.model = {};

            this.render();
        },

        render: function()
        {
            if(!_.isEmpty(this.model))
            {
                this.$el.html(this.template( { model: this.model } ));

                $( '#modelCreateLink' ).on('click', this.model, function(event) {
                    event.data.trigger('modelCreate');
                });

                $( '#speciesEditorLink' ).on('click', this.model,
                                             function(event) {
                                                 event.data.trigger('speciesEditor');
                                             });
                $( '#parameterEditorLink' ).on('click', this.model, function(event) { event.data.trigger('parameterEditor'); });
                $( '#reactionEditorLink' ).on('click', this.model, function(event) { event.data.trigger('reactionEditor'); });
            }
            else
            {
                this.$el.html(this.template());
            }

            return this;
        }
    });

ModelEditor.SaveStatus = Backbone.View.extend(
    {
        events : { "click #save_button" : "save" },

        initialize: function()
        {
            this.template = _.template( $( '#saveStatusTemplate' ).html() );

            this.changed = false;

            this.saveDebounce = _.debounce(this.save, 2000);
        },

        attach: function(model)
        {
            if(!_.isEmpty(this.model))
            {
                this.detach();
            }
            
            this.listenTo(model, 'change', this.change);
            this.listenTo(model, 'destroy', this.detach);
            this.listenTo(model, 'sync', this.sync);
            
            this.model = model;
            
            this.changed = false;
            
            this.render();
        },

        detach: function()
        {
            this.stopListening(this.model);

            this.render();
        },

        change: function()
        {
            this.changed = true;

            this.saveDebounce();

            this.render();
        },

        sync: function()
        {
            this.changed = false;

            this.render();
        },
        
        save: function()
        {
            if(this.changed) {
                this.model.save();
            }
        },

        render: function()
        {
            if(_.has(this, 'model'))
            {
                this.$el.html(this.template( { changed : this.changed, model: this.model.attributes } ));
            }
            else
            {
                this.$el.html(this.template());
            }

            return this;
        }
    });

/*ModelEditor.ModelCreateTableRow = Backbone.View.extend({
    tagName: '<tr>',

    events: { "click .select" : "select",
              "click .delete" : "delete"
            },

    initialize: function()
    {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);

	this.template = _.template('<td><a class="select" href="#"><%= model.attributes.name %> (Model <%= model.attributes.id %>)</a></td>\
<td><%= model.type %></td>\
<td><a class="delete" href="#">Delete</a></td>');

        this.render();
    },

    select: function() {
        this.model.trigger('select');
    },

    delete: function() {
        this.model.destroy();
    },

    render: function() {
        this.$el.html(this.template({ model: this.model }));

        this.delegateEvents();

        return this;
    }
});*/

ModelEditor.ModelCreate = Backbone.View.extend(
    {
        events : { "click .modelCreate": 'createModel' },
        
        initialize: function()
        {
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'destroy', this.remove);
            
            this.template = _.template( $( '#modelCreateTemplate' ).html() );
	    this.rowTemplate = _.template('<tr>\
<td><a class="select" href="#"><%= model.attributes.name %> (Model <%= model.attributes.id %>)</a></td>\
<td><%= model.type %></td>\
<td><a class="delete" href="#">Delete</a></td>\
</tr>');

            this.rows = [];

            this.render();
        },

        attach: function(row)
        {
            this.rows[this.rows.length] = row;
        },

        createModel: function()
        {
            var name = this.$el.find( '#modelName' ).val();

            var type = (this.$el.find( '.concentration' ).prop("checked")) ? "concentration" : "population";

            var model = new stochkit.Model({name : name, type : type});
            
            /*model.addSpecies('S1', 10000);
            model.addSpecies('S2', 0);
            model.addSpecies('S3', 0);
            
            model.addReaction('R1', [['S1', 1]], [], 'S1 * c1');
            model.addReaction('R2', [['S2', 2]], [['S1', 1]], 'S2 * c2');
            model.addReaction('R3', [['S1', 1]], [['S2', 2]], 'S1 * c3');
            model.addReaction('R4', [['S2', 1]], [['S3', 1]], 'S2 * c4');
            
            model.addParameter('c1', 1.0);
            model.addParameter('c2', 0.002);
            model.addParameter('c3', 0.5);
            model.addParameter('c4', 0.04);*/
            
            this.collection.add(model);

            //model.collection = this.collection; // Sigh

            model.save();
        },

        render: function(eventName)
        {
            this.$el.html(this.template());

            for(var i = 0; i < this.collection.models.length; i++)
            {
                model = this.collection.models[i];

                row = $( this.rowTemplate({ model : model }) ).appendTo(this.$el.find('#table'));

                row.find('.select').on('click', model, function(event) { event.data.trigger('select'); event.preventDefault(); });
                row.find('.delete').on('click', model, function(event) { event.data.remove(); event.preventDefault(); } );
            } 

            return this;
        }
    });

$( document ).ready( function() {

    loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

var run = function()
{
    var modelCollection = new stochkit.ModelCollection();

    var menuView = new ModelEditor.MenuBar();
    var modelSelect = new ModelEditor.ModelCreate( { collection : modelCollection } );
    var saveStatus = new ModelEditor.SaveStatus();
    var speciesEditor = new SpeciesEditor.Table();
    var parameterEditor = new ParameterEditor.Page();
    var reactionEditor = new ReactionEditor.Page();

    var Control = Backbone.View.extend(
        {
            initialize: function() {
                this.listenTo(modelCollection, 'add', this.instrumentModel);
                this.listenTo(modelCollection, 'destroy', this.unInstrumentModel);
            },

            instrumentModel: function(addedModel) {
                this.listenTo(addedModel, 'select', _.partial( function(model) { this.selectModel(model); }, addedModel) );

                this.listenTo(addedModel, 'modelCreate', this.modelCreate );
                this.listenTo(addedModel, 'speciesEditor', this.speciesEditor );
                this.listenTo(addedModel, 'parameterEditor', this.parameterEditor );
                this.listenTo(addedModel, 'reactionEditor', this.reactionEditor );

                //var row = new ModelEditor.ModelCreateTableRow( { model : addedModel } );
                
                //Sometimes this isn't set on adding... I think it's a bug?
                addedModel.collection = modelCollection;

                //modelSelect.attach(row);

                modelSelect.render();
           },

            unInstrumentModel: function(model) {
                this.stopListening(model);

                menuView.detach(model);
                saveStatus.detach(model);
                speciesEditor.detach(model);
                parameterEditor.detach(model);
                reactionEditor.detach(model);
            },

            selectModel: function(model)
            {
                menuView.attach(model);
                saveStatus.attach(model);
                speciesEditor.attach(model);
                parameterEditor.attach(model);
                reactionEditor.attach(model);
            },

            modelCreate: function()
            {
                $( '#windowTarget' ).children().detach();
                
                $( '#windowTarget' ).append(modelSelect.render().$el);
            },

            speciesEditor: function()
            {
                $( '#windowTarget' ).children().detach();

                $( '#windowTarget' ).append(speciesEditor.render().$el);
            },

            parameterEditor: function()
            {
                $( '#windowTarget' ).children().detach();

                $( '#windowTarget' ).append(parameterEditor.render().$el);
            },

            reactionEditor: function()
            {
                $( '#windowTarget' ).children().detach();

                $( '#windowTarget' ).append(reactionEditor.render().$el);
            }
        });

    var control = new Control();

    $( '#menuBarTarget' ).append(menuView.render().$el);
    $( '#windowTarget' ).append(modelSelect.render().$el);
    $( '#saveStatusTarget' ).append(saveStatus.render().$el);

    modelCollection.on('sync', function()
                       {
                           console.log('Hi Ho');

                           //model.on('sync', function()
                           //{
                             //           console.log('hihi');
                               //     });
                           
                           //modelCollection.add(model);
                           
                           //model.save();
                       });
    
    modelCollection.fetch();
}

