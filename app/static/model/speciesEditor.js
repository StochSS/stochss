var SpeciesEditor = SpeciesEditor || {};

SpeciesEditor.Table = Backbone.View.extend(
    {
        events : {"click .createSpecies" : "createSpecies"},

        //This View expects to be initialized with:
        //  model -- model it will use to draw
        //  this.view = a jquery selector of the html box it draws into
        initialize: function()
        {
            this.$el.html($( '#speciesEditorTemplate' ).html());
            
            this.table = this.$el.find( '#table' );

            this.render();
        },

        attach: function(model)
        {
            if(_.has(this, 'model') && !_.isEmpty(this.model))
            {
                this.detach();
            }

            this.listenTo(model, 'destroy', this.detach);           

            this.model = model;

            this.render();
        },

        detach: function()
        {
            this.stopListening(this.model);

            this.render();
        },

        createSpecies: function()
        {
            if(_.has(this, 'model'))
            {
		name = this.$el.find( '.name' ).val();
		initialValue = this.$el.find( '.initialValue' ).val();

		this.model.addSpecies(name, initialValue);

		this.render();
            }
        },

        render: function(type)
        {
            this.table.empty();

            if(_.has(this, 'model')) {
                var species = this.model.SpeciesList.children();

                var template = '<tr> \
<td> \
<input type="text" style="width: 100px;" class="name update_box auto_complete" /> \
</td> \
<td> \
<input type="text" style="width: 100px;" class="initial_value update_box autocomplete" /> \
</td> \
<td> \
<input type="text" style="width: 100px;" class="type" readonly="readonly" /> \
</td> \
<td> \
<a class="delete" href="#">Delete</a> \
</td> \
</tr>';

                for(var i = 0; i < species.length; i++) {
                    var row = $( template ).appendTo( this.table );

                    var name = row.find( '.name' );
                    var initial_value = row.find( '.initial_value' );
                    var type = row.find( '.type' );

                    var deleteLink = row.find( '.delete' );
                    
                    specie = $( species[i] );
                    
                    name.val(specie.find('Id').text());
                    initial_value.val(specie.find('InitialPopulation').text());
                    type.val(this.model.type);
                    
                    initial_value.on('keypress', _.debounce(_.partial(function(model, name, initial_value) {
                        model.setSpecies(name.val(), initial_value.val());
                    }, this.model, name, initial_value), 400 ));
                    
                    initial_value.forceNumeric();
                    
                    deleteLink.on('click', _.partial(function(model, id) {
                        model.removeSpecies(id.val())
                    }, this.model, name));
                }
            }

            return this;
        }
    });