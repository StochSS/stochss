function generate_datestr() {
    var temp = new Date();
    //var dateStr = padStr(temp.getFullYear()) +
    var dateStr = padStr(temp.getYear()-100) +
                  padStr(1 + temp.getMonth()) +
                  padStr(temp.getDate()) + '_' +
                  padStr(temp.getHours()) +
                  padStr(temp.getMinutes()) +
                  padStr(temp.getSeconds());
    //console.log(dateStr );
    return dateStr
}

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

//Get and check inputs
var checkAndGet = function(selectTable)
{
    var jobName = $( "#jobName" ).val().trim();

    if(!/^[a-zA-Z_][a-zA-Z0-9_]+$/.test(jobName))
    {
        updateMsg( { status : false,
                     msg : "Job name must be letters (a-z and A-Z), underscores, and numbers only, and start with a letter or an underscore" } );
        return false;
    }

    var execType = $( "input:radio[name=exec_type]:checked" ).val();
    
    var time = $( "#time" ).val();

    time = parseFloat(time);

    if(isNaN(time))
    {
        updateMsg( { status : false,
                     msg : "Time must be a valid floating point value" } );
        return false;
    }

    var increment = $( "#increment" ).val();

    increment = parseFloat(increment);

    if(isNaN(increment))
    {
        updateMsg( { status : false,
                     msg : "Increment must be a valid floating point value" } );
        return false;
    }

    var realizations = $( "#realizations" ).val();

    if(!/^[0-9]+$/.test(realizations))
    {
        updateMsg( { status : false,
                     msg : "Realizations must be an integer" } );
        return false;
    }

    realizations = parseInt(realizations);

    var algorithm = $( "input:radio[name=algorithm]:checked" ).val();
    var seed = $( "#seed" ).val();

    if(!/^[0-9]+$/.test(seed) && seed.trim() != "-1")
    {
        updateMsg( { status : false,
                     msg : "Seed must be an integer (or -1 for random seed)" } );
        return false;
    }

    seed = parseInt(seed);

    var threshold = $( "#threshold" ).val();
    
    ///^[a-zA-Z0-9_\-]+$/.test($(this).val() + String.fromCharCode(key))

    threshold = parseFloat(threshold);

    if(isNaN(threshold))
    {
        updateMsg( { status : false,
                     msg : "Threshold must be a valid floating point number" } );
        return false;
    }

    var rTol = $( "#rTol" ).val();

    rTol = parseFloat(rTol);

    if(isNaN(rTol) || rTol <= 0.0)
    {
        updateMsg( { status : false,
                     msg : "Relative tolerance must be a valid floating point number greater than 0.0" } );
        return false;
    }

    var aTol = $( "#aTol" ).val();

    aTol = parseFloat(aTol);

    if(isNaN(aTol) || aTol <= 0.0)
    {
        updateMsg( { status : false,
                     msg : "Absolute tolerance must be a valid floating point number greater than 0.0" } );
        return false;
    }

    /*var mxSteps = $( "#mxSteps" ).val();

    if(!/^[0-9]+$/.test(mxSteps) || parseInt(mxSteps) <= 0)
    {
        updateMsg( { status : false,
                     msg : "Max steps must be a valid integer greater than 0" } );
        return false;
    }

    mxSteps = parseInt(mxSteps);*/

    var epsilon = $( "#epsilon" ).val();

    if(!(epsilon <= 1.0 && epsilon >= 0.0))
    {
        updateMsg( { status : false,
                     msg : "Epsilon must be between 0.0 and 1.0" } );
        return false;
    }

    epsilon = parseFloat(epsilon)

    var selections = selectTable.state.selections;

    if(execType == "sensitivity")
    {
        var length = 0;
        
        for(key in selections.pc)
            length++;
        
        
        for(key in selections.icc)
            length++;
        
        if(length == 0)
        {
            updateMsg( { status : false,
                         msg : "Must select at least 1 parameter for sensitivity analysis" } );
            return false;
        }
    }

    return { jobName : jobName,
             execType : execType,
             time : time,
             increment : increment,
             realizations : realizations,
             algorithm : algorithm,
             seed : seed,
             threshold : threshold,
             epsilon : epsilon,
             selections : selections,
             aTol : aTol,
             rTol : rTol,
             mxSteps : 10000 }; // mxSteps is not actually working yet.
}

var updateMsg = function(data)
{
    $( "#msg" ).text(data.msg);
    if(data.status)
        $( "#msg" ).prop('class', 'alert alert-success');
    else
        $( "#msg" ).prop('class', 'alert alert-error');
    $( "#msg" ).show();
};


var display_simulation_conf = function(id){
            var simTemplate = _.template( $( "#simulationConfTemplate" ).html() );

            $.get( url = "/models/list/" + id,
                   success = function(data) {
                       //I suck, but these three lines have to come before the rest of this to work...
                       var name = data.name;
                       var units = data.units;
                  
                       $( "#simulationConf" ).html(simTemplate({ name : name,
                                                                 units : units,
                                                                 isSpatial : data.isSpatial,
                                                                 datestr : generate_datestr() }));

                       var selectTable = new Sensitivity.SelectTable();
                       
                       var model = new stochkit.Model(data);
                       
                       model.parse(data);
                       
                       selectTable.attach(model);

                       var handle_type = function() {
                           if( $( "#deterministic" ).eq(0).prop('checked') )
                           {
                               $( ".advanced-settings" ).show();
                               $( ".stochastic" ).hide();
                               $( ".tau-leaping" ).hide();
                               $( ".ssa" ).hide();
                               $( ".sensitivity" ).hide();
                               $( ".ode" ).show();
                           }
                           else if($( "#sensitivity" ).eq(0).prop('checked') )
                           {
                               $( ".advanced-settings" ).hide();
                               $( ".stochastic" ).hide();
                               $( ".tau-leaping" ).hide();
                               $( ".ssa" ).hide();
                               $( ".ode" ).hide();
                               $( ".sensitivity" ).show();
                           }
                           else if( $( "#stochastic" ).eq(0).prop('checked') )
                           {
                               $( ".advanced-settings" ).show();
                               $( ".sensitivity" ).hide();
                               $( ".ode" ).hide()
                               handle_algo();
                               $( ".stochastic" ).show()
                           }
                           else if( $( "#spatial" ).eq(0).prop('checked') )
                           {
                               $( ".advanced-settings" ).show();
                               $( ".sensitivity" ).hide();
                               $( ".ode" ).hide()
                               $( ".stochastic" ).hide()
                               $( ".tau-leaping" ).hide();
                               $( ".ssa" ).hide();
                               //handle_algo();
                               $( ".spatial" ).show()
                           }
                       };
                       
                       var handle_algo = function() {
                           if( $( "#tau-leaping" ).eq(0).prop('checked') )
                           {
                               $( ".ssa" ).hide()
                               $( ".tau-leaping" ).show()
                           }else{
                               $( ".tau-leaping" ).hide()
                               $( ".ssa" ).show()
                           }
                       };

                       $( "#sensitivity, #stochastic, #deterministic, #spatial" ).change(handle_type);
                       $( "#ssa, #tau-leaping" ).change(handle_algo);

                       handle_type();

                       $("#run").click(_.partial(function(selectTable){
                           var resource_info = $('select[name=resource_picker]').val();
                           var resource_info_str = resource_info.replace(/'/g, '"');
                           try{
                               resource_info = JSON.parse(resource_info_str);
                           }
                           catch(err){
                               resource_info = {}
                               resource_info['key_file_id'] = 0
                           }
                           var data = checkAndGet(selectTable);

                           if(!data)
                               return;
                           var message = "Running on ";
                           if(resource_info['key_file_id'] == 0)
                           {
                                message += "StochSS Server"
                                data.resource = "local";
                           }
                           else if (resource_info['key_file_id'] == 1){
                               message += "Cloud"
                               data.resource = "cloud";

                           }
                           else if (resource_info['key_file_id'] == 2){
                               message += "Molns Cloud"
                               data.resource = "molns";
                           }
                           else
                           {
                               message += resource_info['username'] + "@" + resource_info['ip']
                               data.resource = "qsub";
                           }
                           updateMsg( { status: true,
                               msg: message });

                           data.id = id;
                           var url = "";
                           data.selections = selectTable.state.selections;

                           if(data.execType == "sensitivity")
                           {
                               url = "/sensitivity";
                           }
                           else if(data.execType == "spatial")
                           {
                               url = "/spatial";
                           }
                           else
                           {
                               url = "/simulate";
                           }
                           jobName = data.jobName

                           $.post( url = url,
                                   data = { reqType : "newJob",
                                            data : JSON.stringify(data),
                                            cluster_info: resource_info_str }, //Watch closely...
                                   success = function(data)
                                   {
                                       updateMsg(data);
                                       if(data.status)
                                           window.location = '/status?autoforward=1&filter_type=name&filter_value='+jobName;
                                   },
                                   dataType = "json" );

                       }, selectTable));
                       $( "#modelSelect" ).hide();
                       $( "#simulationConf" ).show();
                   },
                   dataType = "json");
}


var run = function()
{
    $( '.mainTable' ).DataTable( { "bLengthChange": false, "bFilter" : false } );
    $( ':radio:not(:disabled):first' ).click();
    $( '.mainTable' ).css('border-bottom', '1px solid #ddd');
    $( '.mainTable thead th' ).css('border-bottom', '1px solid #ddd');

    var id = $.url().param("id");
    var tid = $.url().param("tid");

    if(typeof tid === undefined){
        tid = 'mean';
    }

    if(id){
        $( "#jobInfo" ).show();
        $( "#modelSelect" ).hide();
        $( "#simulationConf" ).hide();

        var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

        $.ajax( { type : "POST",
                  url : "/simulate",
                  data : { reqType : "jobInfo",
                           id : id,
                           tid : tid},
                  success : _.partial(function(id, data) {
                      $( "#jobInfo" ).html(jobInfoTemplate( data.job ));

                      $( "#plotRegion" ).hide();

                      if(data.status == "Finished")
                      {
                          if(data.job.output_location != null && (data.job.resource.toLowerCase() == 'local' || data.job.resource.toLowerCase() == 'qsub' || data.job.output_stored == "True"))
                          {
                              var plotData = []

                              if(data.job.exec_type == "stochastic")
                              {
                                  $( '#trajectorySelectHide' ).show();

                                  var selectTemplate = _.template("<option value='<%= name %>'>trajectory <%= name %></option>");
                                  
                                  for(var i = 0; i < data.job.realizations; i++)
                                  {
                                      $( selectTemplate( { name : i } ) ).appendTo( $( "#trajectorySelect" ))
                                  }
                                  
                                  $( "#trajectorySelect" ).val( tid );
                                  
                                  $( "#trajectorySelect" ).change( _.partial(function(id) {
                                      //var text = $(this).text();
                                      //var hiddenForm = $('<form class="hidden-form" action="something.php" method="post" style="display: none;"><textarea name="id">' + id + '</textarea><textarea name="tid">' + tid + '</textarea></form>').appendTo('body');
                                      //hiddenForm.submit();
                                      window.location = window.location.pathname + "?id=" + id + "&tid=" + $(this).val();
                                  }, id));
                              }
                              else
                              {
                                  $( '#trajectorySelectHide' ).hide();
                              }

                              $( "#plotRegion" ).show();

                              $( "#access" ).html( '<i class="icon-download-alt"></i> Access local data' );
                              $( "#access" ).click( _.partial(function(id) {
                                  updateMsg( { status : true,
                                               msg : "Packing up data... (will forward you to file when ready)" } );
                                  $.ajax( { type : "POST",
                                            url : "/simulate",
                                            data : { reqType : "getDataLocal",
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
                                                updateMsg( { status : false,
                                                             msg : "Server error pulling data from cloud" } );
                                            },
                                            dataType : 'json'
                                          });
                              }, id));

                              var totalSpecies = 0;
                              var totalPts = 1000;

                              for(var specie in data.values.trajectories)
                              {
                                  totalSpecies += 1;
                              }

                              for(var specie in data.values.trajectories)
                              {
                                  var series = [];

                                  var pts = data.values.trajectories[specie].length;
                                  var mult = 1.0;

                                  var ptsPerSpecie = Math.min(pts, Math.floor(totalPts / totalSpecies))
                                  //interpolate to 500 pts
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
                                      
                                  for(var i = 0; i < pts; i++)
                                  {
                                      var id = Math.floor(mult * i);
                                      series.push( { x : data.values.time[id], y : data.values.trajectories[specie][id]} );
                                  }

                                  plotData.push( { label : specie,
                                                   data : series } );
                              }

                              if(!data.job.units)
                              {
                                  label = "";
                              }
                              else
                              {
                                  label = data.job.units.charAt(0).toUpperCase() + data.job.units.slice(1);
                              }

                              gplot = Splot.plot( "Species select", $( "#plot" ), plotData, label);
                              //$( "#plotButton" ).click( gplot.getImage );
                          }
                          else
                          {
                              $( "#access" ).click( _.partial(function(id) {
                                  updateMsg( { status : true,
                                               msg : "Downloading data from cloud... (page will refresh when finished)" } );

                                  $.ajax( { type : "POST",
                                            url : "/simulate",
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
                                                updateMsg( { status : false,
                                                             msg : "Server error pulling data from cloud" } );
                                            },
                                            dataType : 'json'
                                          });
                              }, id));
                          }
                      }
                      else
                      {
                          $( "#error" ).html('<span><h4>Job Failed</h4><br />Stdout:<br /><pre>' + data.stdout + '</pre></span><br /><span>Stderr:<br /><pre>' + data.stderr + '</pre></span>');

                          if(data.job.output_location != null)
                          {                          
                              $( "#access" ).html( '<i class="icon-download-alt"></i> Access input data for debugging' );
                              $( "#access" ).click( _.partial(function(id) {
                                  updateMsg( { status : true,
                                               msg : "Packing up data... (will forward you to file when ready)" } );
                                  $.ajax( { type : "POST",
                                            url : "/simulate",
                                            data : { reqType : "getDataLocal",
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
                          }
                          else
                          {
                              $( "#access" ).html( '<i class="icon-download-alt"></i>No input data available for debugging' );
                              $( "#access" ).prop("disabled",true);
                          }
                      }
                  }, id),
                  error: function(data)
                  {
                      updateMsg( { status : false,
                                   msg : "Server error accessing job info" } );
                  },
                  dataType : 'json'
                });
    } else {          
        var model_id = $.url().param("model_id");
        if(model_id){
            $( "#modelSelect" ).hide();
            $( "#simulationConf" ).show();
            $( "#jobInfo" ).hide();
            display_simulation_conf(model_id);
        }else{
            $( "#modelSelect" ).show();
            $( "#simulationConf" ).hide();
            $( "#jobInfo" ).hide();

            $( "#next" ).click( function() {
                var values = $( "input:radio[name=model_to_simulate]:checked" ).val().split(" ");
                var model_id = parseInt(values[1]);
                display_simulation_conf(model_id);
                
                });
        }
    }
}
