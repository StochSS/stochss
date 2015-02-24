
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
            this.updateWorldCamera();
            this.renderer2.render(this.scene2, this.camera2);
            requestAnimationFrame(_.bind(this.renderFrame, this));
            this.controls.update();

        },

        
        addGui : function() {
            $(" #container").show();
            $( '#zoomPlus_btn' ).click( _.bind(function() { this.controls.dollyOut();}, this) );
            $( '#zoomMinus_btn' ).click( _.bind(function() { this.controls.dollyIn();}, this) );
            $( '#panLeft_btn' ).click( _.bind(function() { this.controls.panLeft(-0.1);}, this) );
            $( '#panRight_btn' ).click( _.bind(function() { this.controls.panLeft(0.1);}, this) );
            $( '#panUp_btn' ).click( _.bind(function() { this.controls.panUp(-0.1);}, this) );
            $( '#panDown_btn' ).click( _.bind(function() { this.controls.panUp(0.1);}, this) );

            $( '#rotateUp_btn' ).click( _.bind(function() { this.controls.rotateUp(0.5);}, this) );
            $( '#rotateDown_btn' ).click( _.bind(function() { this.controls.rotateUp(-0.5);}, this) );
            $( '#rotateRight_btn' ).click( _.bind(function() { this.controls.rotateLeft(0.5);}, this) );
            $( '#rotateLeft_btn' ).click( _.bind(function() { this.controls.rotateLeft(-0.5);}, this) );
            $( '#reset_btn' ).click( _.bind(function() { this.controls.reset();this.camera.position.z = 1.5; }, this) ); 
         },


        createText : function(letter, x, y, z){

            // create a canvas element
            var canvas1 = document.createElement('canvas');
            var context1 = canvas1.getContext('2d');
            context1.font = "Bold 20px Arial";
            context1.fillStyle = "rgba(0,0,0,0.95)";
            context1.fillText(letter, 20, 20);
            
            // canvas contents will be used for a texture
            var texture1 = new THREE.Texture(canvas1) 
            texture1.needsUpdate = true;
              
            var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
            material1.transparent = true;

            var mesh1 = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1),
                material1
              );
            mesh1.position.set(x, y, z);
            this.scene2.add( mesh1 );
        },

        addAxes : function(){
            var dom2 = $( '#inset' ).empty();
            var camera2 = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000);
            this.camera2 = camera2; 
            
            // renderer
            var renderer2 = new THREE.WebGLRenderer({ alpha: true });
            renderer2.setClearColor( 0x000000, 0 ); 
            renderer2.setSize( this.d_width/5, this.d_width/5);
            $( renderer2.domElement ).appendTo(dom2);
            
            this.renderer2 = renderer2;
            
            // scene
            var scene2 = new THREE.Scene();
            this.scene2 = scene2;
            
            // axes
            var dir = new THREE.Vector3( 1.0, 0.0, 0.0 );
            var origin = new THREE.Vector3( 0, 0, 0 ); 
            var hex = 0xff0000; 
            var material = new THREE.LineBasicMaterial({ color: hex });
            var geometry = new THREE.Geometry();
            geometry.vertices.push( origin, dir );
            var line = new THREE.Line( geometry, material );
            //var coneGeometry = new THREE.CylinderGeometry( 0, 0.5, 1, 5, 1 );
            //coneGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 1.0, 0.0, 0 ) );
            //var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color: color } ) );
            //   this.cone.matrixAutoUpdate = false;
            //   this.add( this.cone );
            this.createText('X',1.25, -0.3, 0);
            this.scene2.add( line );
            
            
            dir = new THREE.Vector3( 0, 1.0, 0 );
            origin = new THREE.Vector3( 0, 0, 0 ); 
            hex = 0x0000ff; 
            material = new THREE.LineBasicMaterial({ color: hex });
            geometry = new THREE.Geometry();
            geometry.vertices.push( origin, dir );
            line = new THREE.Line( geometry, material );
            this.createText('Y', 0.5,0.5,0);            
            scene2.add( line );
            
            
            dir = new THREE.Vector3( 0, 0, 1.0 );
            origin = new THREE.Vector3( 0, 0, 0 ); 
            hex = 0x00ff00; 
            material = new THREE.LineBasicMaterial({ color: hex });
            geometry = new THREE.Geometry();
            geometry.vertices.push( origin, dir );
            line = new THREE.Line( geometry, material );
            this.createText('Z', 0.5,-0.4,0.9);
            scene2.add( line );
        },


        updateWorldCamera: function(){
            this.camera2.position.subVectors( this.camera.position, this.controls.target );
            this.camera2.position.setLength( 1.8 );
            this.camera2.lookAt( this.scene2.position );
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

            if(typeof(this.webGL) == 'undefined')
            {
                var canvas = document.createElement('canvas');
                this.webGL = Boolean(canvas.getContext("webgl"));
                delete canvas;
            }

            if (!this.webGL) {
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
                var width = dom.width(); this.d_width = width;
                var height = 0.75 * width; this.d_height = height;
                var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
                var renderer = new THREE.WebGLRenderer();
                renderer.setSize( width, height);
                renderer.setClearColor( 0xffffff, 1);
                
                var rendererDom = $( renderer.domElement ).appendTo(dom);
                
                var controls = new THREE.OrbitControls( camera, renderer.domElement );
                controls.noZoom = true;

                camera.position.z = 1.5;

                this.camera = camera;
                this.renderer = renderer;
                this.controls = controls;

                // Adding gui
                this.addGui();
                
                // Adding Axes
                this.addAxes();
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

            var speciesSelect = $("#speciesSelect");

            speciesSelect.on('change', _.bind(this.handleSpeciesSelect, this));

            for(var i in sortedSpecies) {
                var specie = sortedSpecies[i];

                var input = $( '<option value="' + specie + '">' + specie + '</option>' ).appendTo( speciesSelect );
                //var input = $( '<div><input type="radio" name="speciesSelect" value="' + specie + '"> ' + specie + '</div>' ).appendTo( $( '#speciesSelect' ) ).find( 'input' );

                // Select default
                if(typeof this.selectedSpecies === 'undefined')
                {
                    this.selectedSpecies = specie;
                }

                if(this.selectedSpecies == specie)
                {
                    input.trigger('change');
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

                    console.log("at finished");
                    console.log("at resource");
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





