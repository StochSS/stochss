
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

var updateMsg = function(data)
{
    $( "#msg" ).text(data.msg);
    if(data.status)
        $( "#msg" ).prop('class', 'alert alert-success');
    else
        $( "#msg" ).prop('class', 'alert alert-error');
    $( "#msg" ).show();
};

var StochOptim = StochOptim || {}

StochOptim.Controller = Backbone.View.extend(
    {
        el : $("#stochoptim"),

        // These are the states of the controller
        MODELSELECT : 1,
        SIMULATIONCONFIGURE : 2,
        RESULTSVIEW : 3,

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            this.stage = this.MODELSELECT;

            this.nextButton = undefined;

            // We gotta go off to the server and get this information
            this.models = undefined;

            // We gotta go off to the server and fetch this too
            this.model = undefined;

            // We gotta fetch this as well!
            this.csvFiles = undefined;

            //this.on('select', _.bind(this.select, this) );

            // Draw a screen so folks have something to see
            this.render();

            // Go off and fetch those models and queue up a render on completion
            this.models = new stochkit.ModelCollection();

            // Go get the csvFiles we have hosted
            this.csvFiles = new fileserver.FileList( [], { key : 'stochoptimdata' } );

            // When finished, queue up another render
            this.models.fetch( { success : _.bind(this.render, this) } );

            this.csvFiles.fetch( { success : _.bind(this.render, this) } );
        },
        
        // This event gets fired when the user selects a csv data file
        selectPreview : function(data)
        {
            var preview = $( this.el ).find( '#preview' );

            csv = $.csv.toArrays(data, { separator : '\t' });

            if(csv[1][0] == 0)
            {
                updateMsg( { status : false,
                             msg : 'Timepoint zero specified in input file. This will be overwritten by initial conditions in model' } );
            }

            TablePlot.plot(preview, data, data, 'text');
            //preview.html( data.attributes.preview );
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
            else if(this.stage == this.SIMULATIONCONFIGURE)
            {
            }
            else
            {
            }
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
                } 

                $( this.el ).html( modelSelectTemplate( { models : data } ) );

                // Set event handler on the next button

                this.nextButton = $( this.el ).find( "#next" )
                this.nextButton.click( _.bind( this.buttonClicked, this) );
            }
            //If the user clicks next, then we take the model and ask the user how they want it StochOptim'ed
            else if(this.stage == this.SIMULATIONCONFIGURE)
            {
                $( this.el ).empty();

                var simulationConfTemplate = _.template( $( "#simulationConfTemplate" ).html() );

                $( this.el ).html( simulationConfTemplate( { model : this.model, csvFiles : this.csvFiles } ) );

                var checkboxTemplate = _.template("<input type='checkbox' value='<%= name %>'/><span>&nbsp;<%= name %>&nbsp;<span />");

                var parameters = this.model.getParameters();

                var initialCheckbox = undefined;

                this.activate = {}

                this.activateDiv = $( "#activate" );

                for(var p in parameters)
                {
                    this.activate[parameters[p].name] = false;
                    
                    var checkbox = $( checkboxTemplate( { name : parameters[p].name } ) ).appendTo( this.activateDiv ).eq(0);

                    if(!initialCheckbox)
                    {
                        initialCheckbox = checkbox;
                    }

                    if((p + 1) % 20 == 0)
                    {
                        $( "<br>" ).appendTo(this.activateDiv);
                    }
                    
                    checkbox.change(_.partial(function(controller, checkbox, name) {
                        controller.activate[name] = checkbox.prop('checked');
                    }, this, checkbox, parameters[p].name));
                }

                if(initialCheckbox)
                {
                    initialCheckbox.trigger("click");
                }

                if(typeof this.csvFiles != 'undefined')
                {
                    var csvSelect = $( this.el ).find('#csvSelect');

                    // Draw all the available CSVFiles in the CSV Select box
                    for(var i = 0; i < this.csvFiles.models.length; i++)
                    {

	                this.optionTemp = _.template('<tr> \
<td><a href="javascript:preventDefault();">Delete</a></td><td><input type="radio" name="archive"></td><td><%= attributes.path %></td>\
</tr>');

                        var newOption = $( this.optionTemp( this.csvFiles.models[i]) ).appendTo( csvSelect );

                        // When the csvFiles gets selected, fill the preview box with a preview of the first x bytes of the file
                        newOption.find('input').on('click', _.bind(_.partial( function(data) {
                            this.selectedData = data;
                            $.ajax( { url: '/FileServer/large/stochoptimdata/' + data.attributes.id + '/500/file.txt',
                                     success : _.bind( this.selectPreview, this) });
                        }, this.csvFiles.models[i]), this));

                        // When the delete button gets clicked, use the backbone service to destroy the file
                        newOption.find('a').click( _.bind(_.partial(function(data, event) {
                            data.destroy(); // After the file is deleted, we should post up a msg
                            event.preventDefault();
                            this.render();
                        }, this.csvFiles.models[i]), this));
                    }

                    // When a user uploads a file, draw a status bar, and after the upload is finished request the refreshes
                    $( this.el ).find('#fileupload').fileupload({
                        url: '/FileServer/large/' + 'stochoptimdata',
                        dataType: 'json',
                        send: _.bind(function (e, data) {
                            names = "";
                            
                            for(var i in data.files)
                            {
                                names += data.files[i].name + " ";
                            }
                            
                            var progressbar = _.template('<span><%= name %> :<div class="progress"> \
<div class="bar" style="width:0%;"> \
</div> \
</div> \
</span>');

                            progressHandle = $( this.el ).find( '#progresses' );

                            progressHandle.empty();
                            $( progressbar({ name : names }) ).appendTo( progressHandle );
                        }, this),

                        done: _.bind(function (e, data) {
                            this.csvFiles.fetch( { success : _.bind(this.render, this) } );
                        }, this),

                        progressall: _.bind(function (e, data) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            $( this.el ).find( '#progresses' ).find( '.bar' ).css('width', progress + '%');
                            $( this.el ).find( '#progresses' ).find( '.bar' ).text(progress + '%');
                        }, this),

                        error : function(data) {
                            updateMsg( { status : false,
                                         msg : "Server error uploading file" } );
                        }
                    }).prop('disabled', !$.support.fileInput)
                        .parent().addClass($.support.fileInput ? undefined : 'disabled');

                    // Have something selected
                    csvSelect.find('input').eq(0).click();
                }

                $( "#runLocal" ).click( _.bind(function() {
                    updateMsg( { status: true,
                                 msg: "Running job locally..." } );

                    var data = checkAndGet();
                    
                    if(!data)
                        return;
                    
                    data.dataID = this.selectedData.attributes.id;
                    data.modelID = this.model.attributes.id;
                    data.resource = "local";
                    data.activate = this.activate;
                    
                    var url = "/stochoptim";
                    
                    $.post( url = url,
                            data = { reqType : "newJob",
                                     data : JSON.stringify(data) }, //Watch closely...
                            success = function(data)
                            {
                                updateMsg(data);
                                if(data.status)
                                    window.location = '/status';
                            },
                            dataType = "json" );
                }, this));
                
                $( "#runCloud" ).click( _.bind(function() {
                    updateMsg( { status: true,
                                 msg: "Running job in the cloud..." } );

                    var data = checkAndGet();
                    
                    if(!data)
                        return;
                    
                    data.dataID = this.selectedData.attributes.id;
                    data.modelID = this.model.attributes.id;
                    data.resource = "cloud";
                    data.activate = this.activate;
                    
                    var url = "/stochoptim";
                    
                    $.post(url = url,
                        data = {
                            reqType : "newJob",
                            data : JSON.stringify(data)
                        },
                        success = function(data)
                        {
                            updateMsg(data);
                            if (data.status)
                                window.location = '/status';
                        },
                        dataType = "json"
                    );
                }, this));
            }
            else if(this.stage == this.RESULTSVIEW)
            {
            }
        }
    }
);

var run = function()
{
    //var id = $.url().param("id");

    var cont = new StochOptim.Controller();
}
