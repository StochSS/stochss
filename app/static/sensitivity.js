var Sensitivity = Sensitivity || {}

var updateMsg = function(data)
{
    $( "#msg" ).html(data.msg);
    if(data.status)
        $( "#msg" ).css('color', 'green');
    else
        $( "#msg" ).css('color', 'red');
    $( "#msg" ).show();
};

Sensitivity.SelectTable = Backbone.View.extend(
    {
        initialize: function(attributes, options)
        {
            this.$el = $( "#selectTable" );

	    this.rowTemplate = _.template('<span><input type="checkbox" /><%= name %></span>');

            this.pc = this.$el.find('#parameterContainer');
            this.icc = this.$el.find('#initialConditionContainer');

            this.state = { id : undefined, selections : { pc : {}, icc : {} } };
            
            this.$el.hide();
        },

        attach: function(model)
        {
            if(!_.isEmpty(this.model))
            {
                this.detach();
            }

            this.model = model;

            this.state.id = model.id;
            $( "#name" ).val(model.attributes.name + "_sens");

            this.render();

            this.listenTo(model, 'destroy', this.detach);           
        },

        detach: function()
        {
            this.stopListening(this.model);

            this.state = { id : undefined, selections : { pc : {}, icc : {} } };

            this.render();

            this.$el.hide();
        },

        render: function()
        {
            this.pc.empty();
            this.icc.empty();

            this.$el.hide();

            if(_.has(this, 'model')) {
                var parameters = this.model.ParametersList.children();

                for(var i = 0; i < parameters.length; i++) {
                    var parameter = parameters.eq(i);

                    var id = parameter.find('Id').text();

                    var html = this.rowTemplate({ name : id + ((i == parameters.length - 1) ? '' : ', ') });

                    var boxparam = $( html ).appendTo( this.pc );

                    boxparam.find('input').change( _.partial(function(state, id, event) {
                        state[id] = $( event.target ).prop( 'checked' );
                    }, this.state.selections.pc, id) );
                }

                /*var species = this.model.SpeciesList.children();

                for(var i = 0; i < species.length; i++) {
                    var specie = species.eq(i);

                    var id = specie.find('Id').text();

                    var html = this.rowTemplate({ name : id });

                    var boxparam = $( html ).appendTo( this.icc );

                    boxparam.find('input').change( _.partial(function(state, id, event) {
                        state[id] = $( event.target ).prop( 'checked' );
                    }, this.state.selections.icc, id) );
                }*/

                this.$el.show();
            }

            return this;
        }
    });
