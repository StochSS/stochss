var Sensitivity = Sensitivity || {}

var updateMsg = function(data)
{
    $( "#msg" ).html(data.msg);
    if(data.status)
        $( "#msg" ).prop('class', 'alert alert-success');
    else
        $( "#msg" ).prop('class', 'alert alert-danger');
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
                var parameters = this.model.attributes.parameters;

                var firstBoxParam = '';

                var parameters = _.sortByNat(parameters, function(p) { return p.name }); 

                for(var i = 0; i < parameters.length; i++) {
                    var parameter = parameters[i];

                    var id = parameter.name;

                    var html = this.rowTemplate({ name : id + ((i == parameters.length - 1) ? '' : ', ') });

                    var boxparam = $( html ).appendTo( this.pc );

                    if((i + 1) % 20 == 0)
                    {
                        $( "<br>" ).appendTo(this.pc);
                    }
                    if(firstBoxParam == '')
                    {
                        firstBoxParam = boxparam.find('input');
                    }

                    boxparam.find('input').change( _.partial(function(state, id, event) {
                        state[id] = $( event.target ).prop( 'checked' );
                    }, this.state.selections.pc, id) );
                }

                $( '.selectAll' ).click( _.bind(function() {
                    this.pc.find('input').each(function() {
                        if(!this.checked)
                            this.click();
                    });
                }, this));

                $( '.clearAll' ).click( _.bind(function() {
                    this.pc.find('input').each(function() {
                        if(this.checked)
                            this.click();
                    });
                }, this));

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

                if(firstBoxParam != '')
                {
                    firstBoxParam.prop('checked', true).trigger('change');
                }
                this.$el.show();
            }

            return this;
        }
    });
