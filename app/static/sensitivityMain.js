
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
        var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

        //var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));

        $.ajax( { type : "POST",
                  url : "/sensitivity",
                  data : { reqType : "jobInfo",
                           id : id },
                  success : _.partial(function(id, data) {
                      //console.log(data.status)
                      $( "#jobInfo" ).html(jobInfoTemplate( data.job ));

                      $( "#plotRegion" ).hide();

                      if(data.status == "Finished")
                      {
                          console.log(data);
                          if (data.job.resource == "cloud" && data.job.outData == null)
                          {
                              $( "#access" ).click( _.partial(function(id) {
                                  updateMsg( { status : true,
                                               msg : "Downloading data from cloud... (page will refresh when finished)" } );

                                  $.ajax( { type : "POST",
                                            url : "/sensitivity",
                                            data : { reqType : "getFromCloud",
                                                     id : id },
                                            success : function(data) {
                                                updateMsg(data);

                                                if(data.status == true)
                                                {
                                                    location.reload() ;
                                                }
                                            },
                                            
                                            error: function(data)
                                            {
                                                console.log("do I get called?");
                                            },
                                            dataType : 'json'
                                          });
                              }, id));
                          }
                          else
                          {
                              var plotData = []

                              $( "#plotRegion" ).show();

                              $( "#access" ).text( "Access local data" );
                              $( "#access" ).click( _.partial(function(id) {
                                  updateMsg( { status : true,
                                               msg : "Packing up data... (will forward you to file when ready)" } );
                                  $.ajax( { type : "POST",
                                            url : "/sensitivity",
                                            data : { reqType : "getLocalData",
                                                     id : id },
                                            success : function(data) {
                                                updateMsg(data);
                                            
                                                if(data.status == true)
                                                {
                                                    window.location = data.url;
                                                }
                                            },
                                        
                                            error: function(data)
                                            {
                                                console.log("do I get called?");
                                            },
                                            dataType : 'json'
                                          });
                              }, id));

                              data = data.values
                          
                              var totalSpecies = 0;
                              var totalPts = 2000;

                              var minimums = {};

                              for(var specie in data.trajectories)
                              {
                                  totalSpecies += 1;

                                  minimums[specie] = undefined;

                                  for(var k = 0; k < data.trajectories[specie].length; k++)
                                  {
                                      if(data.trajectories[specie][k] > 0.0)
                                      {
                                          if(minimums[specie] != undefined)
                                          {
                                              minimums[specie] = Math.min(minimums[specie], data.trajectories[specie][k]);
                                          }
                                          else
                                          {
                                              minimums[specie] = data.trajectories[specie][k];
                                          }
                                      }
                                  }

                                  console.log(minimums)
                              }

                              for(var specie in data.sensitivities)
                              {
                                  for(var parameter in data.sensitivities[specie])
                                  {
                                      var series = [];
                                  
                                      var pts = data.trajectories[specie].length;
                                      var mult = 1.0;
                                      //interpolate to 100 pts
                                      var ptsPerSpecie = Math.min(pts, Math.floor(totalPts / totalSpecies))
                                      if(pts > ptsPerSpecie)
                                      {
                                          $( "#interpolateWarning" ).show()
                                          mult = pts / ptsPerSpecie;
                                          pts = ptsPerSpecie;
                                      }
                                      else
                                      {
                                          $( "#interpolateWarning" ).hide()
                                          mult = 1;
                                      }

                                      for(var k = 0; k < data.sensitivities[specie][parameter].length; k++)
                                      {
                                          id = Math.round(mult * k);
                                          series.push({ x : data.time[id + 1],
                                                        y : data.sensitivities[specie][parameter][k] * data.parameters[parameter] / (data.trajectories[specie][id + 1] + minimums[specie] * 1e-5)});
                                      }
               
                                      plotData.push( { label : "d" + specie + "/d" + parameter,
                                                       data : series } );
                                  }
                              }

                              for(var specie in data.trajectories)
                              {
                                  var series = [];

                                  var pts = data.trajectories[specie].length;
                                  var mult = 1.0;
                                  //interpolate to 100 pts
                                  var ptsPerSpecie = Math.min(pts, Math.floor(totalPts / totalSpecies))
                                  if(pts > ptsPerSpecie)
                                  {
                                      $( "#interpolateWarning" ).show()
                                      mult = pts / ptsPerSpecie;
                                      pts = ptsPerSpecie;
                                  }
                                  else
                                  {
                                      $( "#interpolateWarning" ).hide()
                                      mult = 1;
                                  }        

                                  for(var k = 0; k < data.trajectories[specie].length; k++)
                                  {
                                      id = Math.round(mult * k);
                                      series.push({ x : data.time[id],
                                                    y : data.trajectories[specie][id] });
                                  }

                                  plotData.push( { label : specie,
                                                   data : series } );
                              }
                              
                              Splot.plot( $( "#data" ), plotData, "");
                          }
                      }
                      else
                      {
                          $( "#error" ).html('<span><h4>Job Failed</h4><br />Stdout:<br /><pre>' + data.stdout + '</pre></span><br /><span>Stderr:<br /><pre>' + data.stderr + '</pre></span>');
                      }
                  }, id),
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

