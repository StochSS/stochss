
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

var Spatial = Spatial || {}

Spatial.Controller = Backbone.View.extend(
    {
        el : $("#jobInfo"),

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            // We gotta fetch this also!!
            this.jobInfo = undefined;
            this.meshData = undefined;

            // These are our control states
            this.timeIdx = 0;
            this.selectedSpecies = undefined;
            this.trajectory = 0;

            // Draw a screen so folks have something to see
            this.render();

            // Go get the csvFiles we have hosted
            //this.meshFiles = new meshserver.FileList();
            this.refreshData();
        },

        refreshData : function()
        {
            $.ajax( { url : '/spatial',
                      type : 'GET',
                      reqType : 'json',
                      data : { 'reqType' : 'getJobInfo',
                               'id' : this.attributes.id },
                      success : _.bind(this.render, this) } );
        },

        renderFrame : function() {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(_.bind(this.renderFrame, this));
            this.controls.update();
        },
        
        // This event gets fired when the user selects a csv data file
        meshDataPreview : function(data)
        {
            if(String(data['min']).length > 5 || String(data['max']).length > 5)
            {
                this.minVal = data['min'].toExponential(3);
                this.maxVal = data['max'].toExponential(3);
            }
            else
            {
                this.minVal = String(data['min']);
                this.maxVal = String(data['max']);
            }

            $( "#minVal" ).text(this.minVal);
            $( "#maxVal" ).text(this.maxVal);

            if (!window.WebGLRenderingContext) {
                // Browser has no idea what WebGL is. Suggest they
                // get a new browser by presenting the user with link to
                // http://get.webgl.org
                $( "#meshPreview" ).html('<center><h2 style="color: red;">WebGL Not Supported</h2><br /> \
<ul><li>Download an updated Firefox or Chromium to use StochSS (both come with WebGL support)</li> \
<li>It may be necessary to update system video drivers to make this work</li></ul></center>');
                return;
            }

            var canvas = document.createElement('canvas');
            gl = canvas.getContext("webgl");
            delete canvas;
            if (!gl) {
                // Browser could not initialize WebGL. User probably needs to
                // update their drivers or get a new browser. Present a link to
                // http://get.webgl.org/troubleshooting
                $( "#meshPreview" ).html('<center><h2 style="color: red;">WebGL Disabled</h2><br /> \
<ul><li>In Safari and certain older browsers, this must be enabled manually</li> \
<li>Browsers can also throw this error when they detect old or incompatible video drivers</li> \
<li>Enable WebGL, or try using StochSS in an up to date Chrome or Firefox browser</li> \
</ul></center>');
                return;  
            }

            if(!this.renderer)
            {
                var dom = $( "#meshPreview" ).empty();
                var scene = new THREE.Scene();
                var width = dom.width();
                var height = 0.75 * width;
                var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
                var renderer = new THREE.WebGLRenderer();
                renderer.setSize( width, height);
                renderer.setClearColor( 0xffffff, 1);
                
                var rendererDom = $( renderer.domElement ).appendTo(dom);
                
                var controls = new THREE.OrbitControls( camera, renderer.domElement );
                // var controls = new THREE.OrbitControls( camera );
                //controls.addEventListener( 'change', render );
                
                camera.position.z = 1.5;

                this.camera = camera;
                this.renderer = renderer;
                this.controls = controls;
            }
            else
            {
                delete this.scene;
            }

            var scene = new THREE.Scene();
            var loader = new THREE.JSONLoader();
            
            var model = loader.parse(data['mesh']);

            var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe:false } );
	    
            material.side = THREE.DoubleSide;
            mesh = new THREE.Mesh(model.geometry, material);
            scene.add(mesh);

            delete loader;
            delete material;            
            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000000);
            scene.add(ambientLight);
            hemiLight = new THREE.HemisphereLight( 0x000000, 0x00ff00, 0.6 );
            scene.add(hemiLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            this.scene = scene;

            $( "#meshPreviewMsg" ).hide();
            //$( "#meshPreview" ).show();

            if(!this.rendererInitialized)
            {
                this.renderFrame();
                this.rendererInitialized = true;
            }
        },

        acquireNewData : function()
        {
            //$( "#meshPreview" ).hide();
            $( "#meshPreviewMsg" ).show();

            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData",
                               id : this.attributes.id,
                               data : JSON.stringify( { trajectory : this.trajectory,
                                                        timeIdx : this.timeIdx } )},
                      success : _.bind(this.handleMeshDataUpdate, this)
                    });
        },

        handleSliderChange : function(event)
        {
            var slider = $( event.target );

            $( '#timeSelectDisplay' ).text('Time: ' + slider.val())

            this.timeIdx = Math.round( slider.val() / slider.prop('step') );

            this.acquireNewData();
        },

        handleMeshDataUpdate : function(data)
        {
            // Add radio buttons for species select
            $( '#speciesSelect' ).empty();

            this.meshData = data;

            var sortedSpecies = _.keys(data).sort();

            for(var i in sortedSpecies) {
                var specie = sortedSpecies[i];

                var input = $( '<div><input type="radio" name="speciesSelect" value="' + specie + '"> ' + specie + '</div>' ).appendTo( $( '#speciesSelect' ) ).find( 'input' );

                // Register event handler
                input.click(_.bind(this.handleSpeciesSelect, this));

                // Select default
                if(typeof this.selectedSpecies === 'undefined')
                {
                    this.selectedSpecies = specie;
                }

                if(this.selectedSpecies == specie)
                {
                    input.trigger('click');
                }
            }
        },

        handleSpeciesSelect : function(event)
        {
            var species = $( event.target ).val();

            this.selectedSpecies = species;

            this.meshDataPreview(this.meshData[species]);
        },

        handleDownloadDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Downloading data from cloud... (will refresh page when ready)" } );

            $.ajax( { type : "POST",
                      url : "/spatial",
                      data : { reqType : "getDataCloud",
                               id : this.attributes.id },
                      success : function(data) {
                          updateMsg(data);
                          
                          location.reload();
                      },                      
                      error: function(data)
                      {
                          updateMsg( { status : false,
                                       msg : "Server error downloading cloud data" } );
                      },
                      dataType : 'json'
                    });
        },

        handleAccessDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Packing up data... (will forward you to file when ready)" } );

            $.ajax( { type : "POST",
                      url : "/spatial",
                      data : { reqType : "getDataLocal",
                               id : this.attributes.id },
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
                                       msg : "Server error packaging up job data" } );
                      },
                      dataType : 'json'
                    });
        },

        handleTrajectorySelectChange : function(event)
        {
            this.trajectory = Number( $( event.target ).val() );

            this.acquireNewData();
        },

        render : function(data)
        {
            if(typeof data != 'undefined')
            {
                this.jobInfo = data;

                var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

                $( "#jobInfo" ).html( jobInfoTemplate(this.jobInfo) )
                
                if(typeof data.status != 'undefined')
                {
                    updateMsg( data );
                    
                    if(!data.status)
                        return;
                }
                
                if(data['jobStatus'] == 'Finished' && data['complete'] == 'yes')
                {
                    if(data['outData'])
                        $( '#plotRegion' ).show();
                    //Set up trajectory select
                    trajectorySelect = $("#trajectorySelect");
                    for(var i = 0; i < this.jobInfo.indata.realizations; i++)
                    {
                        $( '<option value="' + i + '">Trajectory ' + i + '</option>' ).appendTo( trajectorySelect );
                    }

                    trajectorySelect.on('change', _.bind(this.handleTrajectorySelectChange, this));

                    //Set up slider
                    var slider = $( '#timeSelect' );

                    slider.prop('max', this.jobInfo.indata.time);
                    slider.val(slider.prop('max'));
                    slider.prop('step', this.jobInfo.indata.increment);

                    //Add event handler to slider
                    slider.on('change', _.throttle(_.bind(this.handleSliderChange, this), 1000));

                    slider.trigger('change');
                }
                else
                {
                    $( '#error' ).show();
                }

                $( "#accessOutput" ).show();
                // Add event handler to access button
                if(data['resource'] == 'cloud' && !data['outData'])
                {
                    $( "#access" ).text("Fetch Data from Cloud");                    
                    $( "#access" ).click(_.bind(this.handleDownloadDataButton, this));
                }
                else
                {
                    $( "#access" ).text("Access Local Data");
                    $( "#access" ).click(_.bind(this.handleAccessDataButton, this));
                }
            }
        }
    }
);

var run = function()
{
    var id = $.url().param("id");

    var cont = new Spatial.Controller( { id : id } );
}
