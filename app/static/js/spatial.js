$( document ).ready( function() {
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
            this.wireFlag = false;
            this.playFlag = false;
            
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
            this.refreshData();

            // Initializing cache
            cache = {};
            cacheRange = undefined;
            maxLimit = undefined;

            // preprocessing mesh
            this.preprocessMesh();

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
            $( '#reset_btn' ).click( _.bind(function() { this.controls.reset(); this.camera.position.z = this.mesh.geometry.boundingSphere.radius * 2; }, this) );

            $( '#play_btn' ).click(_.bind(this.playMesh, this));
            $( '#stop_btn' ).click(_.bind(this.stopMesh, this));
        },

        /*
          playMesh is triggered when the playButton is pressed and sets appropriate flags
        */ 
        playMesh: function(){

            this.spt = this.timeIdx;
            this.playFlag = true;
            this.bufferCount = 0;
            this.playCount = 0;
            this.intervalID = setInterval(_.bind(this.play, this), 800);
        },

        play: function(dt){
            if(this.playFlag){
                // stopping animation when time limit is reached
                if(this.timeIdx > maxLimit)
                {
                    this.stopMesh();
                    return;
                }

                // Loading value from cache
                else if(cache[this.timeIdx])
                {
                    console.log("Playing @time"+this.timeIdx);
                    $( "#playStats" ).html( 'Running...');
                    // $('#timeSelect').trigger('change');
                    this.handleSliderChange();
                    // this.handleMeshColorUpdate(cache[this.timeIdx]);

                    this.playCount += 1;

                    if(this.playCount == 25)
                    {
                        this.replaceCache(this.timeIdx - 25, this.timeIdx, this.timeIdx + cacheRange - 25, this.timeIdx + cacheRange);
                        this.playCount = 0;
                    }

                    this.timeIdx += 1;
                    return;
                }
                // If we don't have the value loaded into the cache, wait a few timesteps for it to load before we panic and make an server request
                else if(this.timeIdx <= maxLimit){
                    this.bufferCount+=1;
                    if(this.bufferCount == cacheRange)
                    {
                        $( "#playStats" ).html( 'Buffering...');
                        this.bufferCount = 0;
                        this.updateCache(this.timeIdx, this.timeIdx + cacheRange);
                    }
                }
                
                
            }
        },

        stopMesh: function(){
            console.log("Stopping mesh with Id: "+this.intervalID);
            console.log("STOP!");
            clearInterval(this.intervalID);
            $( "#playStats" ).html( 'Stopped');
            this.playFlag =false;
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
            
            var dir = new THREE.Vector3( 1.0, 0, 0 );
            var origin = new THREE.Vector3( 0, 0, 0 ); 
            var hex = 0xff0000; 
            var material = new THREE.LineBasicMaterial({ color: hex });
            var geometry = new THREE.Geometry();
            geometry.vertices.push( origin, dir );
            var line = new THREE.Line( geometry, material );
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
            console.log("meshDataPreview : function(data)");

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

                var dom = $( "#meshPreview" ).empty();
                var width = dom.width(); this.d_width = width;
                var height = 0.75 * width; this.d_height = height;
                var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
                var renderer = new THREE.WebGLRenderer();
                renderer.setSize( width, height);
                renderer.setClearColor( 0xffffff, 0);
                
                var rendererDom = $( renderer.domElement ).appendTo(dom);
                
                var controls = new THREE.OrbitControls( camera, renderer.domElement );
                camera.position.z = 1.5 ;
                this.camera = camera;

                this.renderer = renderer;
                this.controls = controls;
                this.addGui();
                this.addAxes();


            }
            else
            {
                delete this.scene;
            }
            
            var scene = new THREE.Scene();
            var loader = new THREE.JSONLoader();
            var uniforms =  { xval : {type: 'f', value: -2.0}, yval : {type: 'f', value: -2.0}, zval : {type: 'f', value: -2.0} };

            var material = new THREE.ShaderMaterial( {
                vertexShader:   $('#vertexshader').text(),
                fragmentShader: $('#fragmentshader').text(),
                side : THREE.DoubleSide,
                depthTest: true,
                vertexColors: THREE.VertexColors,
                uniforms: uniforms,
                wireframe: false
            } );
            


            var model = loader.parse(data['mesh']);
            this.model = model;
            mesh = new THREE.Mesh(this.model.geometry, material);
            this.mesh = mesh;
            var radius = this.mesh.geometry.boundingSphere.radius;


            /* 
               GRID
               var grid = new THREE.GridHelper(20, 0.1);          
            */

            // PLANE - X
            var planeGeometry = new THREE.PlaneGeometry(radius*2, radius*2);
            planeX = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0} ));
            planeX.rotateOnAxis( new THREE.Vector3(0,1,0), (Math.PI/2) );
            planeXEdges = new THREE.EdgesHelper( planeX, 0x0000ff ); 
            planeXEdges.material.linewidth = 2;
            planeX.visible = $("#planeXCheck").is(':checked'); planeXEdges.visible = $("#planeXCheck").is(':checked');


            // PLANE - Y
            planeY= new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0} ));
            planeYEdges = new THREE.EdgesHelper( planeY, 0x00ff00 ); 
            planeYEdges.material.linewidth = 2;
            planeY.visible = $("#planeYCheck").is(':checked'); planeYEdges.visible = $("#planeYCheck").is(':checked');
            
            // PLANE - Y
            planeZ = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0} ));
            planeZ.rotateOnAxis( new THREE.Vector3(1,0,0), (Math.PI/2) );
            planeZEdges = new THREE.EdgesHelper( planeZ, 0xff0000 ); 
            planeZEdges.material.linewidth = 2;
            planeZ.visible = $("#planeZCheck").is(':checked'); planeZEdges.visible = $("#planeZCheck").is(':checked');

            scene.add(this.mesh);
            scene.add(planeX);scene.add(planeXEdges);
            scene.add(planeY);scene.add(planeYEdges);
            scene.add(planeZ);scene.add(planeZEdges);

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

            this.camera.position.z =  this.mesh.geometry.boundingSphere.radius* 2;

            //this.highLightSubdomains([])
            
            /* Recalculating distance
               var dist = this.camera.position.z - (this.mesh.geometry.boundingSphere.center.z + this.mesh.geometry.boundingSphere.radius)
               var height = this.mesh.geometry.boundingSphere.radius * 2
               var fov = 2 * Math.atan( height / ( 2 * dist ) ) * ( 180 / Math.PI );
               this.camera.fov = fov;*/


            if(!this.rendererInitialized)
            {
                this.rendererInitialized = true;
                this.setupPlaneSliders();
                this.renderFrame();
            }

        },

        /* 
           Plane methods
        */
        hideMesh: function(){
            // To update uniforms
            console.log("hideMesh: function()");
            var val = parseFloat( $("#planeXSelect").val() ) ;

            this.mesh.material.uniforms.xval.value = val;
            
            val = parseFloat( $("#planeYSelect").val() );
            this.mesh.material.uniforms.yval.value = val;
            
            val = parseFloat( $("#planeZSelect").val() );
            this.mesh.material.uniforms.zval.value = val;

        },

        handlePlaneSliderChange: function(event)
        {
            console.log("handlePlaneSliderChange : function(event)");
            
            var change = false;

            if(planeX.visible){
                var val = $("#planeXSelect").val();
                planeX.position.x = val; 
                planeXEdges.position.x =  val; 
                planeX.geometry.verticesNeedUpdate = true;
                planeXEdges.geometry.verticesNeedUpdate = true;
                change = true;
            }

            if(planeY.visible)
            {
                var val = $("#planeYSelect").val();
                planeY.position.z = val; 
                planeYEdges.position.z =  val; 
                planeY.geometry.verticesNeedUpdate = true;
                planeYEdges.geometry.verticesNeedUpdate = true;
                change = true;
            }

            if(planeZ.visible)
            {
                var val = $("#planeZSelect").val();
                planeZ.position.y = val; 
                planeZEdges.position.z =  val; 
                planeZ.geometry.verticesNeedUpdate = true;
                planeZEdges.geometry.verticesNeedUpdate = true;
                change = true;                
            }

            if(change){
                this.hideMesh();
            }

        },

        setupPlaneSliders : function(){

            console.log("setupPlaneSliders : function()");

            // For plane X
            var slider = $( "#planeXSelect" );
            var sphere = this.mesh.geometry.boundingSphere;
            var min = sphere.center.x - sphere.radius;
            var max = sphere.center.x + sphere.radius;
            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            //var pos = sphere.center;
            //pos.x = min;
            slider.prop('step', (max - min)/10 ) ;
            slider.on('change', _.throttle(_.bind(this.handlePlaneSliderChange, this), 1000));
            slider.trigger('change');


            // For plane Y
            var slider = $( "#planeYSelect" );
            var min = sphere.center.z - (sphere.radius);
            var max = sphere.center.z + (sphere.radius);
            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            slider.prop('step', (max - min)/15 ) ;
            slider.on('change', _.throttle(_.bind(this.handlePlaneSliderChange, this), 1000));
            slider.trigger('change');

            // For plane z
            var slider = $( "#planeZSelect" );
            var min = sphere.center.y - (sphere.radius);
            var max = sphere.center.y + (sphere.radius);
            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            slider.prop('step', (max - min)/15 ) ;
            slider.on('change', _.throttle(_.bind(this.handlePlaneSliderChange, this), 1000));
            slider.trigger('change');
        },

        /*

          Caching Methods

        */

        deleteCache : function(start1, stop1){


            console.log(" deleteCache : function("+start1+", "+stop1+")");
            
            var start = Math.max(0, start1);
            var idx = start; 


            if(stop1 == -1)
            {
                delete cache[start];
                return;
            }
            
            var stop = Math.min(stop1, maxLimit);
            while(idx!=stop)
            {
                delete cache[idx];
                idx = idx + 1;
            }

        },

        replaceCache : function(stime1, etime1, stime2, etime2){
            console.log("replaceCache : function("+stime1+","+stime2+")");
            this.deleteCache(stime1, etime1);
            this.updateCache(stime2, etime2);
        },

        updateCache : function(start1, stop1, colorFlag){
            var start = start1;
            var stop = Math.min(stop1, maxLimit);

            console.log(" updateCache : function("+start+", "+stop+")");


            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "onlyColorRange",
                               id : this.attributes.id,
                               data : JSON.stringify( { trajectory : this.trajectory, timeStart : start , timeEnd: stop} )},
                      success : _.bind(function(data) {
                          if(Object.keys(cache).length > 50)
                          {
                              cache = {};
                          }
                          
                          var time = _.keys(data).sort();
                          for (var i = 0; i < time.length; i++) {
                              var t = time[i]; 
                              cache[t] = data[t];
                          }
                          
                          if(colorFlag)
                              this.handleMeshColorUpdate(cache[time[0] ]);
                          
                      }, this)
                    });
        },

        preprocessMesh : function(){
            $.ajax( { type : "GET", 
                      url : "/spatial", 
                      data : { reqType : "preprocess", 
                               id : this.attributes.id, 
                               data : JSON.stringify( { trajectory : this.trajectory} ) },
                      success : function(){ 
                          console.log("-- Preprocessing Completed -- ")
                      }
                    } );
        },

        updateMesh : function(){
            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData",
                               id : this.attributes.id,
                               data : JSON.stringify( { trajectory : this.trajectory,
                                                        timeIdx : this.timeIdx } )},
                      success : _.bind(this.handleMeshDataUpdate, this)
                    });
        },


        updateMeshWithCache : function(){
            

            $.when(
                $.ajax( { type : "GET", url : "/spatial", data : { reqType : "timeData", 
                                                                   id : this.attributes.id, 
                                                                   data : JSON.stringify( { trajectory : this.trajectory, timeIdx : this.timeIdx })
                                                                 } } ),

                $.ajax( { type : "GET", url : "/spatial",  data : { reqType : "onlyColorRange", 
                                                                    id : this.attributes.id, 
                                                                    data : JSON.stringify({ trajectory : this.trajectory, timeStart : 0 , timeEnd: ( this.jobInfo.indata.time < 50 ?  this.jobInfo.indata.time : 50 ) })
                                                                  } } )
            ).done(_.bind(function(data1, data2)
                          {
                              this.handleMeshDataUpdate(data1[0]);

                              var time = _.keys(data2[0]).sort();
                              
                              for (var i = 0; i < time.length; i++) {
                                  var t = time[i]; 
                                  cache[t] = data2[0][t];
                              }

                              cacheRange =  (this.jobInfo.indata.time < 50 )?  this.jobInfo.indata.time : 50;  

                          }, this)) ;
        },

        acquireNewData : function()
        {
            console.log("acquireNewData : function()");

            // If cache is available
            if(cache[this.timeIdx] && this.meshData)
            {
                this.handleMeshColorUpdate(cache[this.timeIdx]); 
                return;
            }
            else
            {
                if(!this.playFlag)
                    $( "#meshPreviewMsg" ).show();
                
                // If mesh is availablevailable
                if(this.meshData){
                    var start  = this.timeIdx ;
                    var end = (this.timeIdx + cacheRange);
                    this.updateCache(start , end, true);
                    $( "#meshPreviewMsg" ).hide();
                    return;
                }

                // Neither cache or mesh available
                else{
                    this.updateMeshWithCache();
                    $( "#meshPreviewMsg" ).hide();
                    return;
                }
            }


        },
        
        handleSliderChange : function(event)
        {
            console.log("handleSliderChange : function(event)");

            
            if(event && event.originalEvent){
                var slider = $( event.target );
                $( '#timeSelectDisplay' ).text('Time: ' + slider.val())
                this.timeIdx = Math.round( slider.val() / slider.prop('step') );
                
            }
            else{
                var slider = $( '#timeSelect' );
                slider.val(this.timeIdx);
                $( '#timeSelectDisplay' ).text('Time: ' + this.timeIdx);   
            }
            
            this.acquireNewData();

        },

        handleMeshDataUpdate : function(data)
        {
            console.log(" handleMeshDataUpdate : function(data)");
            $( '#speciesSelect' ).empty();
            this.meshData = data;
            var sortedSpecies = _.keys(data).sort();
            this.handleMeshUpdate(sortedSpecies);

        },

        handleMeshColorUpdate : function(data)
        {
            console.log("handleMeshColorUpdate : function(data)");
            var val = $( '#speciesSelect' ).val();
            this.redrawColors( data[val].mesh );
            this.mesh.geometry.colorsNeedUpdate = true;


            $( "#meshPreviewMsg" ).hide();
        },

        redrawColors : function(colors) {
            colors2 = [];

            for(var i = 0; i < colors.length; i++)
            {
                colors2[i] = new THREE.Color(colors[i]);
            }

            for(var i = 0; i < this.mesh.geometry.faces.length; i++)
            {
                var faceIndices = ['a', 'b', 'c'];         
                var face = this.mesh.geometry.faces[i];   
                
                // assign color to each vertex of current face
                for( var j = 0; j < 3; j++ )  
                {
                    var vertexIndex = face[ faceIndices[ j ] ];
                    face.vertexColors[ j ] = colors2[vertexIndex];
                }
                
            }


        },

        handleMeshUpdate: function(sortedSpecies)
        {

            console.log("handleMeshUpdate: function(sortedSpecies)");
            var speciesSelect = $("#speciesSelect");

            speciesSelect.off('change');
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
                    speciesSelect.val(this.selectedSpecies);
                    input.trigger('change');
                }
            }

        },

        handleSpeciesSelect : function(event)
        {
            console.log("handleSpeciesSelect : function(event)");
            var species = $( event.target ).val();
            this.selectedSpecies = species;

            if(event.originalEvent)
                this.handleMeshColorUpdate(cache[this.timeIdx]);
            else
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
            this.preprocessMesh();
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
                    
                    trajectorySelect.off('change');
                    trajectorySelect.on('change', _.bind(this.handleTrajectorySelectChange, this));

                    //Set up slider
                    var slider = $( '#timeSelect' );

                    slider.prop('max', this.jobInfo.indata.time);
                    slider.val(slider.prop('max'));
                    slider.prop('step', this.jobInfo.indata.increment);

                    maxLimit = this.jobInfo.indata.time;

                    //Add event handler to slider
                    slider.off('change');
                    slider.on('change', _.throttle(_.bind(this.handleSliderChange, this), 1000));
                    slider.trigger('change');

                    // Set up radio buttons
                    var withWire = $("#withWire");
                    withWire.click(_.bind(function(){
                        console.log('withWire.click');
                        this.mesh.material.wireframe = true;
                        this.mesh.material.needsUpdate = true;
                    }, this));

                    var withoutWire = $("#withoutWire");
                    withoutWire.click(_.bind(function(){
                        console.log('withoutWire.click');  
                        this.mesh.material.wireframe = false;
                        this.mesh.material.needsUpdate = true;
                    }, this));

                    var checkbox = $( "#planeXCheck" );
                    checkbox.click(_.bind(function(){
                        
                        console.log('checkbox x click');
                        
                        if($("#planeXCheck").is(':checked'))
                        {
                            planeX.visible = true; planeXEdges.visible = true; 
                        }

                        else{
                            planeX.visible = false; planeXEdges.visible = false;
                            $( "#planeXSelect" ).val( $( "#planeXSelect" )[0].min ) ;
                        }
                        planeX.position.x = $( "#planeXSelect" ).val();
                        this.hideMesh();

                    }, this));

                    var checkbox = $( "#planeYCheck" );
                    checkbox.click(_.bind(function(){ 
                        console.log('checkbox y click');
                        
                        if($("#planeYCheck").is(':checked'))
                        {
                            planeY.visible = true; planeYEdges.visible = true;
                            
                        }

                        else{
                            planeY.visible = false; planeYEdges.visible = false;
                            $( "#planeYSelect" ).val( $( "#planeYSelect" )[0].min ) ;
                        }
                        planeY.position.z = $( "#planeYSelect" ).val();
                        this.hideMesh();

                    }, this));

                    var checkbox = $( "#planeZCheck" );
                    checkbox.click(_.bind(function(){
                        console.log('checkbox z click');

                        if($("#planeZCheck").is(':checked'))
                        {
                            planeZ.visible = true; planeZEdges.visible = true;
                            
                        }

                        else{
                            planeZ.visible = false; planeZEdges.visible = false;
                            $( "#planeZSelect" ).val( $( "#planeZSelect" )[0].min ) ;
                        }
                        planeZ.position.y = $( "#planeZSelect" ).val();
                        this.hideMesh();
                        
                    }, this));

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





