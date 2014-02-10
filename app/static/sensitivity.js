var Sensitivity = Sensitivity || {}

Sensitivity.SelectTable = Backbone.View.extend(
    {
        initialize: function(attributes, options)
        {
            this.$el = $( '#selectTable' );

	    this.rowTemplate = _.template('<tr>\
<td><input type="checkbox" /></td>\
<td><%= name %></td>\
</tr>');

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

            if(_.has(this, 'model')) {
                var parameters = this.model.ParametersList.children();

                for(var i = 0; i < parameters.length; i++) {
                    var parameter = parameters.eq(i);

                    var id = parameter.find('Id').text();

                    var html = this.rowTemplate({ name : id });

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
            }

            this.$el.show();

            return this;
        }
    });

$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

var run = function()
{
    var id = $.url().param("id");

    if(id)
    {
        $( "#jobInfo" ).show();

        //var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));

        $.ajax( { type : "POST",
                  url : "/sensitivity",
                  data : { reqType : "jobInfo",
                           id : id },
                  success : function(data) {
                      console.log(data.status)
                      if(data.status == "Finished")
                      {
                          var flotData = []

                          data = data.values

                          for(var specie in data.sensitivities)
                          {
                              for(var parameter in data.sensitivities[specie])
                              {
                                  var series = [];

                                  for(var k = 0; k < data.sensitivities[specie][parameter].length; k++)
                                  {
                                      series.push([data.time[k + 1], data.sensitivities[specie][parameter][k]]);
                                  }
               
                                  flotData.push( { label : "d" + specie + "/d" + parameter,
                                                   data : series } );

                              }
                          }
                          
                          Splot.plot( $( "#data" ), flotData);
                      }
                      else
                      {
                          $( "#data" ).text('Stdout:' + data.stdout + 'Stderr' + data.stderr);
                      }
                  },
                  error: function(data)
                  {
                      console.log("do I get called?");
                  },
                  dataType : 'json'
                });
    }
    else
    {
        $( "#newJob" ).show();
        
        var modelCollection = new stochkit.ModelCollection();

        var selectTable = new Sensitivity.SelectTable();

        var Control = Backbone.View.extend(
            {
                events : {"click .runlocal" : "runSensitivity" },

                initialize: function() {
                    this.$el = $( 'body' );
                    this.modelSelect = this.$el.find( '#modelSelect' );
                    
                    this.listenTo(modelCollection, 'add', this.instrumentModel);
                    this.listenTo(modelCollection, 'destroy', this.unInstrumentModel);
                    
                    //Forward the select even down to the selected option
                    $( '#modelSelect' ).change( function(event) {
                        $( event.target ).find( "option:selected" ).trigger('select');
                    });
                },

                instrumentModel: function(addedModel) {
                    var newOption = $( _.template('<option><%= attributes.name %></option>', addedModel) ).appendTo( this.modelSelect );

                    //This event isn't normally delivered. We set this up in init
                    newOption.on('select', _.partial( function(control, model) {
                        control.selectModel(model);
                    }, this, addedModel));

                    //this.listenTo();
                    
                    //Sometimes this isn't set on adding... I think it's a bug?
                    addedModel.collection = modelCollection;
                },

                unInstrumentModel: function(model) {
                },

                selectModel: function(model)
                {
                    selectTable.attach(model);
                },

                runSensitivity: function()
                {
                    $.ajax({ url : '/sensitivity',
                             type : 'POST',
                             data : { reqType : "newJob",
                                      selections : JSON.stringify(selectTable.state.selections),
                                      id : selectTable.state.id,
                                      time : $( "#time" ).val(),
                                      dt : $( "#dt" ).val(),
                                      name : $( "#name" ).val()},
                             success : function(data) {
                                 console.log(data);
                             },
                             dataType : 'json'
                           });
                }
            });

        // This is where most of the miscellaneous junk should go
        var control = new Control();

        // Get the ball rolling
        modelCollection.fetch({ success : function(modelSelect) {
            $( '#modelSelect' ).trigger('change');
        } });
    }
}

