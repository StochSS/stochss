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

    var stepsA = parseFloat($( "#stepsA" ).val());

    if(stepsA % 1 != 0 || stepsA < 2)
    {
        updateMsg( { status : false,
                     msg : "Steps in sweep variable 1 must be an integer greater than or equal to two" } );
        return false;
    }

    var stepsB = parseFloat($( "#stepsB" ).val());

    if(stepsB % 1 != 0 || stepsA < 2)
    {
        updateMsg( { status : false,
                     msg : "Steps in sweep variable 2 must be an integer greater than or equal to two" } );
        return false;
    }

    var stepsB = parseFloat($( "#stepsB" ).val());

    if(stepsB % 1 != 0 || stepsA < 2)
    {
        updateMsg( { status : false,
                     msg : "Steps in sweep variable 2 must be an integer greater than or equal to two" } );
        return false;
    }

    var maxTime = parseFloat($( "#maxTime" ).val());

    if(maxTime <= 0)
    {
        updateMsg( { status : false,
                     msg : "The final simulation time increment must be greater than zero" } );
        return false;
    }

    var increment = parseFloat($( "#increment" ).val());

    if(increment <= 0)
    {
        updateMsg( { status : false,
                     msg : "The time increment must be greater than zero" } );
        return false;
    }

    var seed = parseFloat($( "#seed" ).val());

    if(seed % 1 != 0 || seed < -1.0)
    {
        updateMsg( { status : false,
                     msg : "Seed must be an integer greater than or equal to -1" } );
        return false;
    }

    var trajectories = parseFloat($( "#trajectories" ).val());

    if(trajectories % 1 != 0 || trajectories < 1)
    {
        updateMsg( { status : false,
                     msg : "Number of trajectories must be an integer greater than zero" } );
        return false;
    }

    return { jobName : jobName,
             parameterA : $( "#parameterA" ).val(),
             minValueA : $( "#minValueA" ).val(),
             maxValueA : $( "#maxValueA" ).val(),
             stepsA : stepsA,
             logA : $( "#logA" ).prop('checked'),
             parameterB : $( "#parameterB" ).val(),
             minValueB : $( "#minValueB" ).val(),
             maxValueB : $( "#maxValueB" ).val(),
             stepsB : stepsB,
             logB : $( "#logB" ).prop('checked'),
             maxTime, maxTime,
             increment : increment,
             trajectories : trajectories,
             seed : seed };
}

var updateMsg = function(data, msg)
{
    if(typeof msg == 'undefined')
    {
        msg = "#msg";
    }
    else
    {
        msg = "#csvMsg";
    }

    if(!_.has(data, 'status'))
    {
        $( msg ).text('').prop('class', '');

        return;
    }

    var text = data.msg;

    if(typeof text != 'string')
    {
        text = text.join('<br>')
    }

    $( msg ).html(text);
    if(data.status)
        $( msg ).prop('class', 'alert alert-success');
    else
        $( msg ).prop('class', 'alert alert-error');
    $( msg ).show();
};

var ParameterSweep = ParameterSweep || {}

ParameterSweep.Controller = Backbone.View.extend(
    {
        el : $("#stochoptim"),

        events : {
            "click #next" : "buttonClicked",
            "change #parameterA" : "selectParameter",
            "change #parameterB" : "selectParameter",
            "change input[name=variableCount]" : "selectVariableCount",
            "click .selectAll" : "selectAllSpecies",
            "click .clearAll" : "clearAllSpecies"
        },

        // These are the states of the controller
        MODELSELECT : 1,
        SIMULATIONCONFIGURE : 2,

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            this.stage = this.MODELSELECT;

            this.nextButton = undefined;

            // This collection is initially populated with data written to a hidden div by the server
            this.models = undefined;

            this.model = undefined;

            this.models = new stochkit.ModelCollection();

            var data = JSON.parse($( '#initialData' ).text());

            this.models.add(data);

            this.render();
        },
        
        buttonClicked : function()
        {
            if(this.stage == this.MODELSELECT)
            {
                var id = parseInt($( "input:radio[name=model_to_simulate]:checked" ).val());

                this.model = this.models.get(id);
                this.stage = this.SIMULATIONCONFIGURE;
                this.render();
            }
        },

        selectParameter : function()
        {
            var paramA = $( "#parameterA" ).val();
            var paramB = $( "#parameterB" ).val();

            $( "#parameterA option" ).prop("disabled", false);
            $( "#parameterB option" ).prop("disabled", false);

            $( "#parameterB option[value=\"" + paramA + "\"]" ).prop("disabled", true);
            $( "#parameterA option[value=\"" + paramB + "\"]" ).prop("disabled", true);

            var valA = this.values[paramA];
            var valB = this.values[paramB];

            $( "#minValueA" ).val( "0.1 * " + valA );
            $( "#maxValueA" ).val( "10.0 * " + valA );

            $( "#minValueB" ).val( "0.1 * " + valB );
            $( "#maxValueB" ).val( "10.0 * " + valB );
        },

        selectVariableCount : function()
        {
            this.variableCount = ($("input[name=variableCount]:checked").val() == "one") ? 1 : 2;

            if(this.variableCount == 1)
                $( '#rowB' ).hide();
            else
                $( '#rowB' ).show();
        },

        selectAllSpecies : function()
        {
            $( this.el ).find( "#species input" ).prop('checked', true);
        },

        clearAllSpecies : function()
        {
            $( this.el ).find( "#species input" ).prop('checked', false);
        },

        render : function()
        {
            //If we're at the model select stage, just render the available models if that info has been fetched
            if(this.stage == this.MODELSELECT)
            {
                $( this.el ).empty();

                var modelSelectTemplate = _.template( $( "#modelSelectTemplate" ).html() );

                var data = undefined;

                if(typeof this.models != 'undefined')
                {
                    data = this.models.models;

                    for(var i in data)
                    {
                        var model = data[i];

                        var isMassAction = true;
                        for(var j in model.attributes.reactions)
                        {
                            if(model.attributes.reactions[j].type == 'custom')
                            {
                                isMassAction = false;
                                break;
                            }
                        }

                        model.attributes.isMassAction = isMassAction;
                    }
                } 

                $( this.el ).html( modelSelectTemplate( { models : data } ) );
                $( this.el ).find( ':radio:not(:disabled):first' ).click();

                $( this.el ).find( '.mainTable' )
                    .DataTable( { "bLengthChange" : false, "bFilter" : false } );

                $( this.el ).find( '.mainTable' ).css('border-bottom', '1px solid #ddd');
                $( this.el ).find( '.mainTable thead th' ).css('border-bottom', '1px solid #ddd');
            }
            //If the user clicks next, then we take the model and ask the user how they want it StochOptim'ed
            else if(this.stage == this.SIMULATIONCONFIGURE)
            {
                $( this.el ).empty();

                var simulationConfTemplate = _.template( $( "#simulationConfTemplate" ).html() );

                $( this.el ).html( simulationConfTemplate({ model : this.model,
                                                            datestr : generate_datestr() }) );

                var parameters = this.model.attributes.parameters;

                this.values = {}

                var optionTemplate = _.template('<option value="<%= name %>"><%= name %></option>');

                for(var p in parameters)
                {
                    this.values[parameters[p].name] = parameters[p].value;

                    $( optionTemplate({ name : parameters[p].name }) ).appendTo( "#parameterA, #parameterB" );               
                }

                $( "#parameterA option" ).eq(0).prop('selected', true);
                $( "#parameterB option" ).eq(1).prop('selected', true);

                var species = this.model.attributes.species;

                var checkboxTemplate = _.template('<span><input type="checkbox" name="species" checked><%= name %><% if(!last) { %>, <% } else { %><% } %></span>');

                this.speciesSelectCheckboxes = {};

                for(var p in species)
                {
                    this.speciesSelectCheckboxes[species[p].name] = $( checkboxTemplate({ name : species[p].name, last : p == species.length - 1 }) ).appendTo( "#species" );               
                }

                $( "#parameterA option" ).eq(0).prop('selected', true);
                $( "#parameterB option" ).eq(1).prop('selected', true);

                this.selectParameter();
                this.selectVariableCount();

                $( "#runMolns" ).click( _.bind(function() {
                    updateMsg( { status: true,
                                 msg: "Running job locally..." } );

                    var data = checkAndGet();
                    
                    if(!data)
                        return;

                    data.modelID = this.model.attributes.id;
                    data.resource = "molns";
                    data.variableCount = this.variableCount;

                    var speciesSelect = {};
                    for(var name in this.speciesSelectCheckboxes)
                    {
                        speciesSelect[name] = this.speciesSelectCheckboxes[name].val();
                    }

                    data.speciesSelect = speciesSelect;

                    var url = "/parametersweep";
                    
                    $.post( url = url,
                            data = { reqType : "newJob",
                                     data : JSON.stringify(data) }, //Watch closely...
                            success = function(data)
                            {
                                updateMsg(data);
                                if(data.status)
                                {
                                    window.location = '/parametersweep/' + String(data.id);
                                }
                            },
                            dataType = "json" );
                }, this));
            }
            
            this.delegateEvents();
        }
    }
);

$( document ).ready( function() {
    var cont = new ParameterSweep.Controller();
});
