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

var mean = function(array)
{
    var sum = 0;

    for(var a in array)
    {
        sum += array[a];
    }

    return sum / array.length;
}

var variance = function(array)
{
    var meanVal = mean(array);

    var sum = 0;

    for(var a in array)
    {
        var d = array[a] - meanVal;

        sum += d * d;
    }

    return sum / array.length;
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

    var crossEntropyStep = $( "#crossEntropyStep" ).prop('checked') ? 1 : 0;
    var emStep = $( "#emStep" ).prop('checked')? 1 : 0;
    var uncertaintyStep = $( "#uncertaintyStep" ).prop('checked')? 1 : 0;

    var seed = parseFloat($( "#seed" ).val());

    if(seed % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "Seed must be an integer" } );
        return false;
    }

    var Kce = parseFloat($( "#Kce" ).val());

    if(Kce % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "Kce must be an integer" } );
        return false;
    }

    var Kem = parseFloat($( "#Kem" ).val());

    if(Kem % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "Kem must be an integer" } );
        return false;
    }

    var Klik = parseFloat($( "#Klik" ).val());

    if(Klik % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "Klik must be an integer" } );
        return false;
    }

    var Kcov = parseFloat($( "#Kcov" ).val());

    if(Kcov % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "Kcov must be an integer" } );
        return false;
    }

    var rho = $( "#rho" ).val();
    rho = parseFloat(rho);
    
    var perturb = $( "#perturb" ).val();
    perturb = parseFloat(perturb);
    
    var alpha = $( "#alpha" ).val();
    alpha = parseFloat(alpha);
    
    var beta = $( "#beta" ).val();
    beta = parseFloat(beta);

    var gamma = $( "#gamma" ).val();
    gamma = parseFloat(gamma);

    var k = parseFloat($( "#k" ).val());

    if(k % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "k must be an integer" } );
        return false;
    }

    var pcutoff = $( "#pcutoff" ).val();
    pcutoff = parseFloat(pcutoff);

    var qcutoff = $( "#qcutoff" ).val();
    qcutoff = parseFloat(qcutoff);

    var numIter = parseFloat($( "#numIter" ).val());

    if(numIter % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "numIter must be an integer" } );
        return false;
    }

    numIter = numIter;

    var numConverge = parseFloat($( "#numConverge" ).val());

    if(numConverge % 1 != 0)
    {
        updateMsg( { status : false,
                     msg : "numConverge must be an integer" } );
        return false;
    }

    numConverge = numConverge;

    return { jobName : jobName,
             crossEntropyStep : crossEntropyStep,
             emStep : emStep,
             uncertaintyStep : uncertaintyStep,
             seed : seed,
             Kce : Kce,
             Kem : Kem,
             Klik : Klik,
             Kcov : Kcov,
             rho : rho,
             perturb : perturb,
             alpha : alpha,
             beta : beta,
             gamma : gamma,
             k : k,
             pcutoff : pcutoff,
             qcutoff : qcutoff,
             numIter : numIter,
             numConverge : numConverge};
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
            "change #parameterA" : "selectParameter",
            "change #parameterB" : "selectParameter"
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

            $( "#parameterA option" ).prop("enabled", true);
            $( "#parameterB option" ).prop("enabled", true);

            $( "#parameterB option[value=" + paramA + "]" ).prop("disabled", true);
            $( "#parameterA option[value=" + paramB + "]" ).prop("disabled", true);

            var valA = this.values[paramA];
            var valB = this.values[paramB];

            $( "#minValueA" ).val( "0.1 * " + valA );
            $( "#maxValueA" ).val( "10.0 * " + valA );

            $( "#minValueB" ).val( "0.1 * " + valB );
            $( "#maxValueB" ).val( "10.0 * " + valB );
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

                this.nextButton = $( this.el ).find( "#next" )
                this.nextButton.click( _.bind( this.buttonClicked, this) );
            }
            //If the user clicks next, then we take the model and ask the user how they want it StochOptim'ed
            else if(this.stage == this.SIMULATIONCONFIGURE)
            {
                $( this.el ).empty();

                var simulationConfTemplate = _.template( $( "#simulationConfTemplate" ).html() );

                $( this.el ).html( simulationConfTemplate() );

                var parameters = this.model.attributes.parameters;

                this.values = {}

                var optionTemplate = _.template('<option value="<%= name %>"><%= name %></option>');

                for(var p in parameters)
                {
                    this.values[parameters[p].name] = parameters[p].value;

                    $( optionTemplate({ name : parameters[p].name }) ).appendTo( "#parameterA, #parameterB" );               
                }

                $( "#parameterA option" ).at(0).prop('selected', true);
                $( "#parameterB option" ).at(1).prop('selected', false);

                this.delegateEvents();

                this.selectParameter();

                $( "#runLocal" ).click( _.bind(function() {
                    updateMsg( { status: true,
                                 msg: "Running job locally..." } );

                    var data = checkAndGet();
                    
                    if(!data)
                        return;

                    data.modelID = this.model.attributes.id;
                    data.resource = "local";
                    data.activate = this.activate;

                    var url = "/parameter_sweep";
                    
                    $.post( url = url,
                            data = { reqType : "newJob",
                                     data : JSON.stringify(data) }, //Watch closely...
                            success = function(data)
                            {
                                updateMsg(data);
                                if(data.status)
                                {
                                    window.location = '/parameter_sweep/' + String(data.id);
                                }
                            },
                            dataType = "json" );
                }, this));
            }
        }
    }
);

var run = function()
{
    //var id = $.url().param("id");

    var cont = new StochOptim.Controller();
}
