var ParameterEditor = ParameterEditor || {};

ParameterEditor.Page = Backbone.View.extend(
    {
        events : {"click .createParameter" : "createParameter"},

        //This View expects to be initialized with:
        //  model -- model it will use to draw
        //  this.view = a jquery selector of the html box it draws into
        initialize: function()
        {
            this.$el.html($( '#parameterEditorTemplate' ).html());
            
            this.table = this.$el.find( '#tableBody' );

            this.render();
        },

        attach: function(model)
        {
            if(_.has(this, 'model'))
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

            delete this.model;

            this.render();
        },

        createParameter: function()
        {
            if(_.has(this, 'model'))
            {
		name = this.$el.find( '.name' ).val();
		expression = this.$el.find( '.expression' ).val();

		this.model.addParameter(name, expression);

		this.render();
            }
        },

        render: function()
        {
            this.table.empty();

            if(_.has(this, 'model')) {
                var parameters = this.model.ParametersList.children();

                var template = '<tr> \
<td> \
<input type="text" style="width: 100px;" class="id update_box auto_complete" /> \
</td> \
<td> \
<input type="text" style="width: 100px;" class="expression update_box autocomplete" /> \
</td> \
<td> \
<a class="delete" href="#">Delete</a> \
</td> \
</tr>';

                for(var i = 0; i < parameters.length; i++) {
                    var row = $( template ).appendTo( this.table );

                    var id = row.find( '.id' );
                    var expression = row.find( '.expression' );

                    var deleteLink = row.find( '.delete' );
                    
                    parameter = parameters.eq(i);
                    
                    id.val(parameter.find('Id').text());
                    expression.val(parameter.find('Expression').text());
                    
                    expression.on('keypress', _.debounce(_.partial(function(model, id, expression) {
                        model.setParameter(id.val(), expression.val());
                    }, this.model, id, expression), 400 ));
                    
                    //expression.forceNumeric();
                    
                    deleteLink.on('click', _.partial(function(model, id) {
                        model.removeParameter(id.val())
                    }, this.model, id));
                }
            }

            return this;
        }
    });