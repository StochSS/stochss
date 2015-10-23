$( document ).ready( function() {
    waitForTemplates(run);
});



var Spatial = Spatial || {}

Spatial.Controller = Backbone.View.extend(
    {
        el : $("#jobInfo"),

        updateMsg : function(data, ele)
        {
            if(!ele)
            {
                ele = "msg";
            }

            var html_ele = $("#"+ele);
            html_ele.text(data.msg);
            if(data.status)
                html_ele.prop('class', 'alert alert-success');
            else
                html_ele.prop('class', 'alert alert-error');
            html_ele.show();
        },

        initialize : function(attributes)
        {
            this.wireFlag = false;
            this.playFlag = false;
            this.playMeshInterval = 1000;
            
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
            this.cache = {};
            this.showPopulation = true;
            this.cacheRange = undefined;
            this.maxLimit = undefined;
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
            
            $( '#speedup_btn' ).click(_.bind(function(){ 
                
                if(this.playFlag)
                {
                    //$( "#playStats" ).html( 'Speeding up...');
                    
                    // As speedy as this can be
                    if(this.playMeshInterval <= 100)
                        return;
                    
                    this.playMeshInterval -=100;

                    $("#playSpeed").html( (1000/this.playMeshInterval).toFixed(2) );
                    
                    clearInterval(this.intervalID);
                    console.log("resetting interval");
                    this.intervalID = setInterval(_.bind(this.play, this), this.playMeshInterval);
                }

                }, 
                this));
            $( '#slowdown_btn' ).click(_.bind(function(){ 
                if(this.playFlag)
                {
                
                    //$( "#playStats" ).html( 'Slowing down...');
                
                    if(this.playMeshInterval >= 6000)
                        return;

                    this.playMeshInterval +=100;

                    $("#playSpeed").html( (1000/this.playMeshInterval).toFixed(2) ) ;

                    clearInterval(this.intervalID);
                    console.log("resetting interval");
                    this.intervalID = setInterval(_.bind(this.play, this), this.playMeshInterval);
                }
                
                }, 
                this));
        },

        /*
          playMesh is triggered when the playButton is pressed and sets appropriate flags
        */ 
        playMesh: function(){

            this.spt = this.timeIdx;

            if(this.timeIdx >= this.maxLimit && this.playFlag == false)
            {
                this.timeIdx = 0;
            }

            this.playFlag = true;
            this.bufferCount = 0;
            this.playCount = 0;


            this.intervalID = setInterval(_.bind(this.play, this), this.playMeshInterval);

        },

        play: function(dt){
            if(this.playFlag){
                // stopping animation when time limit is reached
                if(this.timeIdx > this.maxLimit)
                {
                    this.timeIdx = this.maxLimit;
                    this.stopMesh();
                    return;
                }

                // Loading value from cache
                else if(this.cache[this.timeIdx])
                {

                    console.log("Playing @time"+this.timeIdx);
                    $( "#playStats" ).html( 'running');
                    // $('#timeSelect').trigger('change');
                    this.handleSliderChange();
                    // this.handleMeshColorUpdate(cache[this.timeIdx]);

                    this.playCount += 1;
                    this.bufferCount = 0;

                    if(this.playCount == 25)
                    {
                        this.replaceCache(this.timeIdx - 25, this.timeIdx, this.timeIdx + this.cacheRange - 25, this.timeIdx + this.cacheRange);
                        this.playCount = 0;
                    }

                    this.timeIdx += 1;
                    return;
                }
                // If we don't have the value loaded into the cache, wait a few timesteps for it to load before we panic and make an server request
                else if(this.timeIdx <= this.maxLimit){
                        $( "#playStats" ).html( 'buffering');
                        if(this.bufferCount == 0)
                            {
                                this.updateCache(this.timeIdx, this.timeIdx + this.cacheRange, true);
                            }
                }
                
                
            }
        },

        stopMesh: function(){
            console.log("Stopping mesh with Id: "+this.intervalID);
            console.log("STOP!");
            clearInterval(this.intervalID);
            $( "#playStats" ).html( 'stopped');
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
            renderer2.setClearColor( 0xFFFFFF ); 
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

            if (!window.WebGLRenderingContext) {
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
                renderer.setClearColor( 0xffffff);
                
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
            this.renderer.render(scene, this.camera);
            var loader = new THREE.JSONLoader();


            this.model = loader.parse(data);

            var radius = this.model.geometry.boundingSphere.radius;

            var uniforms =  { xval : {type: 'f', value: -radius}, 
                              yval : {type: 'f', value: -radius}, 
                              zval : {type: 'f', value: -radius},
                              xflag : {type: 'f', value: 0.0},
                              yflag : {type: 'f', value: 0.0}, 
                              zflag : {type: 'f', value: 0.0},
                              xflip : {type: 'f', value: 1.0},
                              yflip : {type: 'f', value: 1.0}, 
                              zflip : {type: 'f', value: 1.0}
                            };

            var material = new THREE.ShaderMaterial( {
                vertexShader:   $('#vertexshader').text(),
                fragmentShader: $('#fragmentshader').text(),
                side : THREE.DoubleSide,
                depthTest: true,
                vertexColors: THREE.VertexColors,
                uniforms: uniforms,
                wireframe: false
            } );
            
            this.mesh = new THREE.Mesh(this.model.geometry, material);
            
            this.boundingBox = {};
            var minx = this.mesh.geometry.boundingSphere.center.x + this.mesh.geometry.boundingSphere.radius;  
            var miny = this.mesh.geometry.boundingSphere.center.y + this.mesh.geometry.boundingSphere.radius;
            var minz = this.mesh.geometry.boundingSphere.center.z + this.mesh.geometry.boundingSphere.radius; 

            var maxx = this.mesh.geometry.boundingSphere.center.x - this.mesh.geometry.boundingSphere.radius;  
            var maxy = this.mesh.geometry.boundingSphere.center.y - this.mesh.geometry.boundingSphere.radius;
            var maxz = this.mesh.geometry.boundingSphere.center.z - this.mesh.geometry.boundingSphere.radius; 

            console.log("minx: "+minx+" maxx: "+maxx+" miny: "+miny+" maxy: "+maxy+" maxz: "+maxz+" minz: "+minz);

            for(var i = 0; i < this.mesh.geometry.vertices.length; i++)
            {
                var x = this.mesh.geometry.vertices[i].x;
                var y = this.mesh.geometry.vertices[i].y; 
                var z = this.mesh.geometry.vertices[i].z; 

                minx = ( minx > x ? x: minx );    
                maxx = ( maxx < x ? x: maxx );

                miny = ( miny > y ? y: miny );    
                maxy = ( maxy < y ? y: maxy );

                minz = ( minz > z ? z: minz );    
                maxz = ( maxz < z ? z: maxz );
            }

            console.log("minx: "+minx+" maxx: "+maxx+" miny: "+miny+" maxy: "+maxy+" maxz: "+maxz+" minz: "+minz);
            
            this.boundingBox.minx = minx;
            this.boundingBox.maxx = maxx;

            this.boundingBox.miny = miny;
            this.boundingBox.maxy = maxy;
            
            this.boundingBox.minz = minz;
            this.boundingBox.maxz = maxz;
            
            /* 
               GRID
               var grid = new THREE.GridHelper(20, 0.1);          
            */

            // PLANE - X
            var planeGeometry = new THREE.PlaneGeometry(maxy-miny, maxz-minz);
            planeX = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0} ));
            planeX.rotateOnAxis( new THREE.Vector3(0,1,0), (Math.PI/2) );
            planeXEdges = new THREE.EdgesHelper( planeX, 0x0000ff ); 
            planeXEdges.material.linewidth = 2;
            planeX.visible = $("#planeXCheck").is(':checked'); 
            planeXEdges.visible = $("#planeXCheck").is(':checked');


            // PLANE - Y
            planeGeometry = new THREE.PlaneGeometry(maxx-minx, maxy-miny);
            planeY= new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial( {  color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0} ));
            planeYEdges = new THREE.EdgesHelper( planeY, 0x00ff00 ); 
            planeYEdges.material.linewidth = 2;
            planeY.visible = $("#planeYCheck").is(':checked'); planeYEdges.visible = $("#planeYCheck").is(':checked');
            
            // PLANE - Z
            planeGeometry = new THREE.PlaneGeometry(maxx-minx, maxz-minz);
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
            
            this.mesh.material.needsUpdate = true;
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
            var min = this.boundingBox.minx;
            var max = this.boundingBox.maxx;
            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            slider.prop('step', (max - min)/10 ) ;
            slider.on('change', _.throttle(_.bind(this.handlePlaneSliderChange, this), 1000));
            slider.trigger('change');


            // For plane Y
            var slider = $( "#planeYSelect" );
            min = this.boundingBox.minz;
            max = this.boundingBox.maxz;
            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            slider.prop('step', (max - min)/15 ) ;
            slider.on('change', _.throttle(_.bind(this.handlePlaneSliderChange, this), 1000));
            slider.trigger('change');

            // For plane z
            var slider = $( "#planeZSelect" );
            min = this.boundingBox.miny;
            max = this.boundingBox.maxy;
            slider.prop('min', this.boundingBox.miny);
            slider.prop('max', this.boundingBox.maxy);
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
                delete this.cache[start];
                return;
            }
            
            var stop = Math.min(stop1, this.maxLimit);
            while(idx!=stop)
            {
                delete this.cache[idx];
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
            var stop = Math.min(stop1, this.maxLimit);

            if(start > stop)
                return;

            console.log(" updateCache : function("+start+", "+stop+")");


            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "onlyColorRange",
                               id : this.attributes.id,
                               data : JSON.stringify( {
                                   showPopulation : this.showPopulation,
                                   trajectory : this.trajectory,
                                   timeStart : start,
                                   timeEnd: stop} )},
                      success : _.bind(function(data) {
                          try {
                              if(typeof(data.colors) == 'undefined')
                                  return

                              var time = _.keys(data.colors).sort();

                              if(time.length == 0)
                                  return
                              for (var i = 0; i < time.length; i++) {
                                  var t = time[i]; 
                                  this.cache[t] = data.colors[t];
                              }

                              this.limits = data.limits;

                              if(this.showPopulation)
                              {
                                  $("#maxVal").html("Maximum voxel population: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                                  $("#minVal").html("Minimum voxel population: " + this.limits[this.selectedSpecies]["min"].toExponential(3) ); 
                              } else {
                                  $("#maxVal").html("Maximum voxel concentration: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                                  $("#minVal").html("Minimum voxel concentration: " + this.limits[this.selectedSpecies]["min"].toExponential(3));  
                              }

                              this.handleMeshColorUpdate(this.cache[time[0]]);

                              if(!this.rendererInitialized)
                              {
                                  this.rendererInitialized = true;
                                  this.setupPlaneSliders();
                                  this.renderFrame();
                              }

                          }
                          catch(err)
                          {
                              this.updateMsg( { status : false, msg : 'Error retrieving time series data from server: ' + err.message}, "meshMsg" );
                          }
                      }, this)
                    });
        },

        getMesh : function(){
            $.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData", 
                               id : this.attributes.id, 
                               data : JSON.stringify( {
                                   trajectory : this.trajectory,
                                   timeIdx : this.timeIdx })
                             },
                      success : _.bind(this.handleGetMesh, this)
                    } );
        },

        handleGetMesh : function(data) {
            try{
            $( '#speciesSelect' ).empty();
            this.meshData = data.mesh;

            this.updateCache(0, this.cacheRange);

            var sortedSpecies = data.species.sort();
            this.setUpSpeciesSelect(sortedSpecies);
            }
          
            catch(err)
            {
                this.updateMsg( { status : false, msg : 'Error retrieving mesh from server: ' + err.message} ,"meshMsg");
            }
        
        },

        acquireNewData : function()
        {
            console.log("acquireNewData : function()");

            // If cache is available
            if(this.cache[this.timeIdx] && this.meshData)
            {
                this.handleMeshColorUpdate(this.cache[this.timeIdx]); 
                return;
            }
            else
            {
                if(!this.playFlag)
                    $( "#meshPreviewMsg" ).show();
                
                // If mesh is availablevailable
                if(this.meshData){
                    var start  = this.timeIdx ;
                    var end = (this.timeIdx + this.cacheRange);
                    this.updateCache(start , end, true);
                    $( "#meshPreviewMsg" ).hide();
                    return;
                }

                // Neither cache or mesh available
                else{
                    this.getMesh();
                    $( "#meshPreviewMsg" ).hide();
                    return;
                }
            }


        },
        
        handleSliderChange : function(event)
        {
            console.log("handleSliderChange : function(event)");

            var isRace = false;
            if(event && event.originalEvent){
                
                // To prevent race conditions during animation
                if(this.playFlag)
                    {this.playFlag = false; isRace = true;}

                var slider = $( event.target );
                $( '#timeSelectDisplay' ).text('Time: ' + slider.val())
                this.timeIdx = Math.round( slider.val() / slider.prop('step') );

                // After the slider reset is over we can animate again
                if(isRace)
                    {this.playFlag = true;}
                

            }
            else{
                var slider = $( '#timeSelect' );
                slider.val(this.timeIdx);
                $( '#timeSelectDisplay' ).text('Time: ' + this.timeIdx);   
            }
            
            this.acquireNewData();

        },

        handleMeshColorUpdate : function(data)
        {
            console.log("handleMeshColorUpdate : function(data)");
            var val = $( '#speciesSelect' ).val();
            this.redrawColors( data[val] );
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

        setUpSpeciesSelect: function(sortedSpecies)
        {
            console.log("setUpSpeciesSelect: function(sortedSpecies)");
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

            if(typeof(this.limits) != 'undefined')
            {
                if(this.showPopulation)
                {
                    $("#maxVal").html("Maximum voxel population: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                    $("#minVal").html("Minimum voxel population: " + this.limits[this.selectedSpecies]["min"].toExponential(3) ); 
                } else {
                    $("#maxVal").html("Maximum voxel concentration: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                    $("#minVal").html("Minimum voxel concentration: " + this.limits[this.selectedSpecies]["min"].toExponential(3));  
                }
            }
            
            if(event.originalEvent)
                this.handleMeshColorUpdate(this.cache[this.timeIdx]);
            else
                this.meshDataPreview(this.meshData);
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

        handleAccessVtkDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Packing up VTK data... (this can take a couple minutes -- will forward you to file when ready)" } );

            $.ajax( { type : "POST",
                      url : "/spatial",
                      data : { reqType : "getVtkLocal",
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

        handleAccessCsvDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Packing up CSV data... (this can take a couple minutes -- will forward you to file when ready)" } );

            $.ajax( { type : "POST",
                      url : "/spatial",
                      data : { reqType : "getCsvLocal",
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
            
                this.cacheRange =  (this.jobInfo.indata.time < 50) ? this.jobInfo.indata.time : 50;

                var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

                $( "#jobInfo" ).html( jobInfoTemplate(this.jobInfo) )
                
                if(typeof data.status != 'undefined')
                {
                    updateMsg( data );
                    
                    if(!data.status)
                        return;
                }
                
                if(data['jobStatus'] == 'Finished' && data['complete'] == 'yes' )
                {
                    if(data['outData']){
                        $( '#plotRegion' ).show();
                        $( '#domainControls' ).show();
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

                        this.maxLimit = this.jobInfo.indata.time;

                        //Add event handler to slider
                        slider.off('change');
                        slider.on('change', _.throttle(_.bind(this.handleSliderChange, this), 1000));
                        slider.trigger('change');

                        // Set up radio buttons

                        var wireSelect = $("#wireSelect");
                        wireSelect.change(_.bind(function(){
                            console.log('unitSelect.click');
                            selectedIndex =  $("#wireSelect")[0].options["selectedIndex"]
                            selectedOption = $("#wireSelect")[0].options[selectedIndex].value
                            if( selectedOption == 'solid')
                                {
                                 this.mesh.material.wireframe = false;
                                this.mesh.material.needsUpdate = true;
                                }
                            else
                                {
                                    this.mesh.material.wireframe = true;
                                    this.mesh.material.needsUpdate = true;
                                }

                            this.cache = {}
                            this.updateCache(this.timeIdx, this.timeIdx + this.cacheRange, true);
                        }, this));


                        var drawUnits = $("#unitSelect");
                        drawUnits.change(_.bind(function(){
                            console.log('unitSelect.click');
                            selectedIndex =  $("#unitSelect")[0].options["selectedIndex"]
                            selectedOption = $("#unitSelect")[0].options[selectedIndex].value
                            if( selectedOption == 'population')
                                {
                                    this.showPopulation  = true;
                                }
                            else
                                {
                                    this.showPopulation  = false;
                                }

                            this.cache = {}
                            this.updateCache(this.timeIdx, this.timeIdx + this.cacheRange, true);
                        }, this));

                        var checkbox = $( "#planeXCheck" );
                        checkbox.click(_.bind(function(){
                            
                            console.log('checkbox x click');
                            var val = 0.0;
                            if($("#planeXCheck").is(':checked'))
                            {
                                planeX.visible = true; planeXEdges.visible = true; 
                                val = 1.0;
                            }

                        else{
                            planeX.visible = false; planeXEdges.visible = false;
                        }
                        planeX.position.x = $( "#planeXSelect" ).val();
                        this.mesh.material.uniforms.xflag.value = val;
                        this.mesh.material.needsUpdate = true;

                        }, this));

                        var checkbox = $( "#planeYCheck" );
                        checkbox.click(_.bind(function(){ 
                            console.log('checkbox y click');
                            
                            var val = 0.0;
                            if($("#planeYCheck").is(':checked'))
                            {
                                planeY.visible = true; planeYEdges.visible = true;
                                val = 1.0;
                            }

                            else{
                                planeY.visible = false; planeYEdges.visible = false;

                            }
                            planeY.position.z = $( "#planeYSelect" ).val();
                            this.mesh.material.uniforms.yflag.value = val;
                            this.mesh.material.needsUpdate = true;

                        }, this));

                        var checkbox = $( "#planeZCheck" );
                        checkbox.click(_.bind(function(){
                            console.log('checkbox z click');
                            var val = 0.0;
                            if($("#planeZCheck").is(':checked'))
                            {
                                planeZ.visible = true; planeZEdges.visible = true; val = 1.0;
                            }

                            else{
                                planeZ.visible = false; planeZEdges.visible = false;

                            }
                            planeZ.position.y = $( "#planeZSelect" ).val();
                            this.mesh.material.uniforms.zflag.value = val;
                            this.mesh.material.needsUpdate = true;
                            
                        }, this));

                        var checkbox = $( "#planeXFlip" );
                        checkbox.click(_.bind(function(){
                            if($("#planeXFlip").is(':checked'))
                            {
                                this.mesh.material.uniforms.xflip.value = -1.0;
                            } else {
                                this.mesh.material.uniforms.xflip.value = 1.0;
                            }

                            this.mesh.material.needsUpdate = true;
                        }, this));

                        var checkbox = $( "#planeYFlip" );
                        checkbox.click(_.bind(function(){
                            if($("#planeYFlip").is(':checked'))
                            {
                                this.mesh.material.uniforms.yflip.value = -1.0;
                            } else {
                                this.mesh.material.uniforms.yflip.value = 1.0;
                            }

                            this.mesh.material.needsUpdate = true;
                        }, this));

                        var checkbox = $( "#planeZFlip" );
                        checkbox.click(_.bind(function(){
                            if($("#planeZFlip").is(':checked'))
                            {
                                this.mesh.material.uniforms.zflip.value = -1.0;
                            } else {
                                this.mesh.material.uniforms.zflip.value = 1.0;
                            }

                            this.mesh.material.needsUpdate = true;
                        }, this));

                        $("#playSpeed").html( (1000/ this.playMeshInterval).toFixed(2) );

                    }
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
                    $( "#access" ).html('<i class="icon-download-alt"></i> Fetch Data from Cloud');                    
                    $( "#access" ).click(_.bind(this.handleDownloadDataButton, this));

		    $( "#accessVtk" ).hide();
		    $( "#accessCsv" ).hide();
                }
                else
                {
                    $( "#access" ).html('<i class="icon-download-alt"></i> Access Local Data');
                    $( "#access" ).click(_.bind(this.handleAccessDataButton, this));

		    $( "#accessVtk" ).show();
                    $( "#accessVtk" ).click(_.bind(this.handleAccessVtkDataButton, this));

		    $( "#accessCsv" ).show();
                    $( "#accessCsv" ).click(_.bind(this.handleAccessCsvDataButton, this));
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





