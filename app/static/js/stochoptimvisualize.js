
$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});


var updateMsg = function(data)
{
    $( "#msg" ).text(data.msg);
    if(data.status)
        $( "#msg" ).prop('class', 'alert alert-success');
    else
        $( "#msg" ).prop('class', 'alert alert-error');
    $( "#msg" ).show();
};

var StochOptimVisualize = StochOptimVisualize || {}

StochOptimVisualize.Controller = Backbone.View.extend(
    {
        el : $("#stochoptim"),

        // These are the states of the controller
        MODELSELECT : 1,
        SIMULATIONCONFIGURE : 2,
        RESULTSVIEW : 3,

        initialize : function(attributes)
        {
            // This is basically the entry function for this file!
            // 
            // Need to: Read in stdout and stderr from invisible divs on page (written there by server)
            // If no error, show pretty output, if error, show raw output
            // 
            // Have option for user to create new model out of discovered parameters on page
            // Have option for user to download copy of the raw data
            //
            //

            this.attributes = attributes;

            this.jobID = parseInt($.url().attr('path').split('/').pop());
            this.stderr = $('#stderr').text();
            this.stdout = $('#stdout').text();
            var nameToIndex = $.parseJSON($( '#nameToIndex' ).text());
            var indexToName = {}

            for(var name in nameToIndex)
            {
                indexToName[nameToIndex[name]] = name;
            }

            this.data = {globalIteration : []};
            this.dataKeys = [];
            this.parameters = {};

            var fileSplit = this.stdout.split(/\r\n|\r|\n/g);
            for(var lineIndex in fileSplit)
            {
                var line = fileSplit[lineIndex];

                if(line.match(/:/g))
                {
                    var lineSplit = line.split(/,/g);
                    this.data["globalIteration"].push(this.data["globalIteration"].length);
                    
                    //On first iteration, there are some standard keys that need to exist
                    if(this.data["globalIteration"].length == 1)
                    {
                        this.dataKeys.push("globalIteration");

                        for(var idx in indexToName)
                        {
                            this.dataKeys.push(indexToName[idx]);

                            this.data[indexToName[idx]] = [];
                        }
                    }

                    for(var pairIndex in lineSplit)
                    {
                        var pair = lineSplit[pairIndex];

                        var keyval = pair.split(/:/);
                        
                        key = keyval[0].trim();
                        
                        // If key == parameters, then the key should be converted to
                        // parameter name
                        if(key == 'parameters')
                        {
                            val = keyval[1].trim();

                            valSplit = val.split(" ");

                            for(var valIndex in valSplit)
                            {
                                this.data[indexToName[valIndex]].push(parseFloat(valSplit[valIndex].trim()));
                                this.parameters[indexToName[valIndex]] = parseFloat(valSplit[valIndex].trim());
                            }
                        }
                        else
                        {                   
                            if(!(key in this.data))
                            {
                                console.log(key);
                                this.dataKeys.push(key);
                                this.data[key] = []
                                for(var i = 0; i < this.data["globalIteration"].length - 1; i++)
                                {
                                    this.data[key].push(NaN);
                                }
                            }

                            val = parseFloat(keyval[1].trim());
                            
                            this.data[key].push(val);
                        }
                    }
                }
            }

            this.textData = "";

            this.textData += this.dataKeys.join("\t") + "\n";

            var dataLists = [];

            for(var key in this.dataKeys)
            {
                dataLists.push( { label : this.dataKeys[key],
                                  data : this.data[this.dataKeys[key]],
                                  lowerBound : undefined,
                                  upperBound : undefined } );
            }

            /*var rows = _.zip.apply(this, dataLists);
            for(var rowIndex in rows)
            {
                this.textData += rows[rowIndex].join("\t") + "\n";
            }*/

            TablePlot.plot(this.$el, dataLists, this.stdout, 'graphic');

            $( "#create" ).click( _.bind(function() {
                updateMsg( { status : true,
                             msg : "Creating model... (will forward you to new model when ready)" } );
                $.ajax( { type : "POST",
                          url : "/stochoptim/create/" + this.jobID,
                          data : { data : JSON.stringify({ parameters : this.parameters,
                                                           proposedName : $( "#name" ).val()
                                                         }) },
                          success : function(data) {
                              updateMsg(data);
                              
                              if(data.status == true)
                              {
                                  //console.log(data.url);
                                  window.location = data.url;
                              }
                          },
                          
                          error: function(data)
                          {
                              updateMsg({ status : false, msg : "Server error when creating new model, check logs" });
                          },
                          dataType : 'json'
                        });
            }, this));

            // Draw a screen so folks have something to see
            this.render();
        },
        
        render : function()
        {
        }
    }
);

var run = function()
{
    var cont = new StochOptimVisualize.Controller();
}
