var ReactionEditor = ReactionEditor || {};

ReactionEditor.Page = Backbone.View.extend(
    {
        //This View expects to be initialized with:
        //  model -- model it will use to draw
        //  this.view = a jquery selector of the html box it draws into
        initialize: function()
        {
            this.$el.html($( '#reactionEditorTemplate' ).html());
            
            this.table = this.$el.find( '#tableBody' );

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

        render: function()
        {
            this.table.empty();

            if(_.has(this, 'model')) {
                var reactions = this.model.ReactionsList.children();

                var template = '<tr> \
<td> \
<input type="text" style="width: 100px;" class="id update_box auto_complete" /> \
</td> \
<td> \
<input type="text" style="width: 100px;" class="expression update_box autocomplete" /> \
</td> \
<td> \
<input type="text" style="width: 100px;" class="propensity update_box autocomplete" /> \
</td> \
<td> \
<a class="delete" href="#">Delete</a> \
</td> \
</tr>';

                for(var i = 0; i < reactions.length; i++) {
                    var row = $( template ).appendTo( this.table );

                    var id = row.find( '.id' );
                    var expression = row.find('.expression');
                    var propensity = row.find('.propensity');

                    var deleteLink = row.find( '.delete' );
                    
                    var reaction = reactions.eq(i);
                    var prettyReaction = stochkit.PrettyPrint.Reaction(reaction);
                    
                    id.val(reaction.find('Id').text());
                    expression.val(prettyReaction.expression);
                    propensity.val(reaction.find('PropensityFunction').text());
                    
                    propensity.on('keypress', _.debounce(_.partial(function(model, id, propensity) {
                        var res = model.getReaction(id.val());
                        model.setReaction(id.val(), res.reactants, res.products, propensity.val());
                    }, this.model, id, propensity), 400 ));
                    
                    deleteLink.on('click', _.partial(function(model, id) {
                        model.removeReaction(id.val())
                    }, this.model, id));
                }
            }

            return this;
        }
    });