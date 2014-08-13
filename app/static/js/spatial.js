
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
        
        // This event gets fired when the user selects a csv data file
        meshDataPreview : function(pyurdmeMeshJsonData)
        {
            var dom = $( "#meshPreview" ).empty();
            var scene = new THREE.Scene();
            var width = dom.width();//
            var height = 0.75 * width;
            var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize( width, height);
            renderer.setClearColor( 0xffffff, 1);
            
            var rendererDom = $( renderer.domElement ).appendTo(dom);
            
            var loader = new THREE.JSONLoader();
            function load_geometry(model){
                var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe:false});
	        
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(model.geometry,material);
                scene.add(mesh);
            }


            var model = loader.parse($.parseJSON(pyurdmeMeshJsonData));
            load_geometry(model);

            var controls = new THREE.OrbitControls( camera, renderer.domElement );
            // var controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );

            camera.position.z = 1.5;
            
            
            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000000);
            scene.add(ambientLight);
            hemiLight = new THREE.HemisphereLight( 0x000000, 0x00ff00, 0.6 );
            scene.add(hemiLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);


            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
                controls.update();
            }
            render();
        },

        handleSliderChange : function(event)
        {
            var slider = $( event.target );

            this.timeIdx = Math.round( slider.val() / slider.prop('step') );
            //$( '#timeSelectDisplay' ).text('Time: '+this.timeIdx)
            $( '#timeSelectDisplay' ).text('Time: ' + slider.val())
            $( "#meshPreview" ).html("<CENTER><H1>Rendering...</H1></CENTER>");

            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData",
                               id : this.attributes.id,
                               data : JSON.stringify( { trajectory : 0,
                                                        timeIdx : this.timeIdx } )},
                      success : _.bind(this.handleMeshDataUpdate, this)
                    });
        },

        handleMeshDataUpdate : function(data)
        {
            // Add radio buttons for species select
            $( '#speciesSelect' ).empty();

            this.meshData = data;

            var sortedSpecies = _.keys(data).sort();

            for(var i in sortedSpecies) {
                var specie = sortedSpecies[i];

                var input = $( '<div><input type="radio" name="speciesSelect" value="' + specie + '">' + specie + '</div>' ).appendTo( $( '#speciesSelect' ) ).find( 'input' );

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

            this.meshDataPreview(this.meshData[species]);
        },

        render : function(data)
        {
            if(typeof data != 'undefined')
            {
                this.jobInfo = data;

                var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

                $( "#jobInfo" ).html( jobInfoTemplate(this.jobInfo) )

                //Set up slider
                var slider = $( '#timeSelect' );

                slider.prop('max', this.jobInfo.indata.time);
                slider.val(slider.prop('max'));
                slider.prop('step', this.jobInfo.indata.increment);

                //Add event handlers
                slider.on('change', _.throttle(_.bind(this.handleSliderChange, this), 1000));

                slider.trigger('change');
            }
        }
    }
);

var run = function()
{
    var id = $.url().param("id");

    var cont = new Spatial.Controller( { id : id } );
}
