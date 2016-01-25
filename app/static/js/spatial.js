$( document ).ready( function() {
    waitForTemplates(run);
});

var Spatial = Spatial || {}

Spatial.Controller = Backbone.View.extend( {
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

        if(data.msg.length > 0)
            html_ele.show();
        else
            html_ele.hide();
    },

    initialize : function(attributes)
    {
        this.wireFlag = false;
        this.playFlag = false;
        this.playMeshInterval = 1000;
        this.volumeRender = false;
        this.dollyFlag = false;
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

        // Go get the basic job information -- render the page when it arrives
        $.ajax( { url : '/spatial',
                  type : 'GET',
                  reqType : 'json',
                  data : { 'reqType' : 'getJobInfo',
                           'id' : this.attributes.id },
                  success : _.bind(this.render, this) } );

        // Initializing cache
        this.cache = {};
        this.showPopulation = false;
        this.cacheRange = undefined;
        this.maxLimit = undefined;

        // We'll construct a MeshToTextureConverter once we get a mesh
        // this.m2texLow -- Low res fast
        // this.m2texHigh -- High res slow
    },

    // This is the render loop
    renderLoop : function() {
        if(this.volumeRender == true)
        {   
            if(!this.dollyFlag)
            {
                var scale = this.mesh.geometry.boundingSphere.radius * 2.0;
                this.controls.dollyIn(scale);
                this.dollyFlag = true;
            }

            this.renderer.render(this.g.scene, this.camera);
        }
        else
        {
            if(this.dollyFlag)
            {
                var scale = this.mesh.geometry.boundingSphere.radius * 2.0;
                this.controls.dollyOut(scale);
                this.dollyFlag = false;
            }
            this.renderer.render(this.scene, this.camera);
        }

        // Update the axes camera to match the regular camera
        this.axes.camera.position.subVectors( this.camera.position, this.controls.target );
        this.axes.camera.position.setLength( 2.0 );
        this.axes.camera.lookAt( this.axes.scene.position );
        
        // Render the axes
        this.axes.renderer.render(this.axes.scene, this.axes.camera);
        requestAnimationFrame(_.bind(this.renderLoop, this));
        this.controls.update();
    },

    addTopControls : function()
    {
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

        $( '#play_btn' ).click(_.bind(this.play, this));
        $( '#stop_btn' ).click(_.bind(this.stop, this));
        
        $( '#speedup_btn' ).click( _.bind(this.speedup, this) );

        $( '#slowdown_btn' ).click( _.bind(this.slowdown, this) );
    },

    play: function()
    {
        if(this.timeIdx >= this.maxLimit && this.playFlag == false)
        {
            this.timeIdx = 0;
        }

        this.playFlag = true;
        this.bufferCount = 0;
        this.playCount = 0;

        this.playLoopInterval = setInterval(_.bind(this.play, this), this.playMeshInterval);
    },

    stop: function(){
        clearInterval(this.playLoopInterval);
        $( "#playStats" ).html( 'stopped');
        this.playFlag = false;
    },

    speedup : function()
    {                 
        if(this.playFlag)
        {
            // As speedy as this can be
            if(this.playMeshInterval <= 100)
                return;
            
            this.playMeshInterval -=100;
            
            $("#playSpeed").html( (1000/this.playMeshInterval).toFixed(2) );
            
            clearInterval(this.playLoopInterval);
            this.playLoopInterval = setInterval(_.bind(this.playLoop, this), this.playMeshInterval);
        }
    },

    slowdown : function()
    {
        if(this.playFlag)
        {
            if(this.playMeshInterval >= 6000)
                return;

            this.playMeshInterval +=100;

            $("#playSpeed").html( (1000/this.playMeshInterval).toFixed(2) ) ;

            clearInterval(this.playLoopInterval);
            this.playLoopInterval = setInterval(_.bind(this.playLoop, this), this.playMeshInterval);
        }
    },

    playLoop: function(dt){
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
                this.handleTimeChange();
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
            // Ben : This seems important but I'm not sure what it means
            // If we don't have the value loaded into the cache
            //   wait a few timesteps for it to load before we panic and make an server request
            else if(this.timeIdx <= this.maxLimit)
            {
                $( "#playStats" ).html( 'buffering');
                if(this.bufferCount == 0)
                {
                    this.updateCache(this.timeIdx, this.timeIdx + this.cacheRange, true);
                }
            }
        }
    },

    createLetter : function(letter, x, y, z){
        // create a canvas element
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        context.font = "Bold 20px Arial";
        context.fillStyle = "rgba(0,0,0,0.95)";
        context.fillText(letter, 20, 20);
        
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas); 
        texture.needsUpdate = true;
        
        var material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide } );
        material.transparent = true;

        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            material
        );

        mesh.position.set(x, y, z);

        return mesh
    },

    addAxes : function(){
        var dom = $( '#inset' ).empty();
        var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000);

        this.axes = {};

        this.axes.camera = camera;
        
        // renderer
        var renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor( 0xffffff ); 
        renderer.setSize( this.d_width/5, this.d_width/5);
        $( renderer.domElement ).appendTo(dom);
        
        this.axes.renderer = renderer;
        
        // scene
        var scene = new THREE.Scene();
        this.axes.scene = scene;
        
        var dir = new THREE.Vector3( 1.0, 0, 0 );
        var origin = new THREE.Vector3( 0, 0, 0 ); 
        var hex = 0xff0000; 
        var material = new THREE.LineBasicMaterial({ color: hex });
        var geometry = new THREE.Geometry();
        geometry.vertices.push( origin, dir );
        var line = new THREE.Line( geometry, material );
        this.axes.scene.add(this.createLetter('X', 1.25, -0.3, 0));
        this.axes.scene.add( line );
        
        dir = new THREE.Vector3( 0, 1.0, 0 );
        origin = new THREE.Vector3( 0, 0, 0 ); 
        hex = 0x00ff00; 
        material = new THREE.LineBasicMaterial({ color: hex });
        geometry = new THREE.Geometry();
        geometry.vertices.push( origin, dir );
        line = new THREE.Line( geometry, material );
        this.axes.scene.add(this.createLetter('Y', 0.5, 0.5, 0));
        this.axes.scene.add( line );
        
        dir = new THREE.Vector3( 0, 0, 1.0 );
        origin = new THREE.Vector3( 0, 0, 0 ); 
        hex = 0x0000ff; 
        material = new THREE.LineBasicMaterial({ color: hex });
        geometry = new THREE.Geometry();
        geometry.vertices.push( origin, dir );
        line = new THREE.Line( geometry, material );
        this.axes.scene.add(this.createLetter('Z', 0.5, -0.4, 0.9));
        this.axes.scene.add( line );
    },

    webGLWorks: function() {
        if(typeof(this.webGL) == 'undefined')
        {
            var canvas = document.createElement('canvas');
            this.webGL = Boolean(canvas.getContext("webgl"));
            delete canvas;
        }

        return Boolean(window.WebGLRenderingContext) && this.webGL;
    },

    constructRenderer : function()
    {
        var data = this.meshData;

        if(typeof(this.renderer) != 'undefined')
        {
            return;
        }

        var dom = $( "#meshPreview" ).empty();
        var width = dom.width();
        this.d_width = width;
        var height = 0.75 * width;
        this.d_height = height;
        var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height);
        renderer.setClearColor( 0xffffff, 1.0);

        var rendererDom = $( renderer.domElement ).appendTo(dom);
        
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        camera.position.z = 1.5 ;
        this.camera = camera;

        this.renderer = renderer;
        this.controls = controls;

        this.addTopControls();
        this.addAxes();
        
        var scene = new THREE.Scene();
        var radius = this.geometry.boundingSphere.radius;

        var uniforms =  { 
            xval : { type: 'f', value: -radius }, 
            yval : { type: 'f', value: -radius }, 
            zval : { type: 'f', value: -radius },
            xflag : { type: 'f', value: 0.0 },
            yflag : { type: 'f', value: 0.0 }, 
            zflag : { type: 'f', value: 0.0 },
            xflip : { type: 'f', value: 1.0 },
            yflip : { type: 'f', value: 1.0 }, 
            zflip : { type: 'f', value: 1.0 }
        };

        var material = new THREE.ShaderMaterial( {
            vertexShader:   $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            side : THREE.DoubleSide,
            //depthTest: true,
            vertexColors: THREE.VertexColors,
            uniforms: uniforms,
            wireframe: false,
            //minFilter : THREE.LinearFilter
        } );
        
        this.mesh = new THREE.Mesh(this.geometry, material);

        this.m2texLow = new MeshToTexture.Converter(this.mesh, this.data.voxelTuples, 0.0, 1.0, 256, 256);

        /* 
           GRID
           var grid = new THREE.GridHelper(20, 0.1);          
        */

        // PLANE - X
        var planeX = new THREE.Mesh(
            new THREE.PlaneGeometry(this.boundingBox.y.max - this.boundingBox.y.min,
                                    this.boundingBox.z.max - this.boundingBox.z.min),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            })
        );

        planeX.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2.0);
        var planeXEdges = new THREE.EdgesHelper(planeX, 0xff0000);
        planeXEdges.material.linewidth = 2;
        planeX.visible = false;
        planeXEdges.visible = $("#planeXCheck").is(':checked');

        // PLANE - Y
        var planeY= new THREE.Mesh(
            new THREE.PlaneGeometry(this.boundingBox.x.max - this.boundingBox.x.min,
                                    this.boundingBox.y.max - this.boundingBox.y.min),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            })
        );

        planeY.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
        var planeYEdges = new THREE.EdgesHelper(planeY, 0x00ff00);
        planeYEdges.material.linewidth = 2;
        planeY.visible = false;
        planeYEdges.visible = $("#planeYCheck").is(':checked');
        
        // PLANE - Z
        planeZ = new THREE.Mesh(
            new THREE.PlaneGeometry(this.boundingBox.x.max - this.boundingBox.x.min,
                                    this.boundingBox.z.max - this.boundingBox.z.min),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            })
        );

        var planeZEdges = new THREE.EdgesHelper(planeZ, 0x0000ff); 
        planeZEdges.material.linewidth = 2;
        planeZ.visible = false;
        planeZEdges.visible = $("#planeZCheck").is(':checked');

        scene.add(this.mesh);

        scene.add(planeX);
        scene.add(planeXEdges);
        scene.add(planeY);
        scene.add(planeYEdges);
        scene.add(planeZ);
        scene.add(planeZEdges);

        this.planes = {
            x : {
                rectangle : planeX,
                edges : planeXEdges,
                uniforms : {
                    val : uniforms.xval,
                    flag : uniforms.xflag,
                    flip : uniforms.xflip
                }
            },
            y : {
                rectangle : planeY,
                edges : planeYEdges,
                uniforms : {
                    val : uniforms.yval,
                    flag : uniforms.yflag,
                    flip : uniforms.yflip
                }
            },
            z : {
                rectangle : planeZ,
                edges : planeZEdges,
                uniforms : {
                    val : uniforms.zval,
                    flag : uniforms.zflag,
                    flip : uniforms.zflip
                }
            }
        };

        delete loader;
        delete material;            
        
        this.scene = scene;

        $( "#meshPreviewMsg" ).hide();

        this.camera.position.z = this.mesh.geometry.boundingSphere.radius* 2;
    },

    /* 
       Plane methods
    */
    hideMesh: function(){
        // To update uniforms
        console.log("hideMesh: function()");

        var valX = parseFloat( $("#planeXSelect").val() ) ;
        var valY = parseFloat( $("#planeYSelect").val() ) ;
        var valZ = parseFloat( $("#planeZSelect").val() ) ;
        
        if(this.volumeRender)
        {
            this.g.mesh.material.uniforms.xval.value = valX;
            this.g.mesh.material.uniforms.yval.value = valY;
            this.g.mesh.material.uniforms.zval.value = valZ;
            this.g.mesh.material.needsUpdate = true;
        }
        else
        {
            this.mesh.material.uniforms.xval.value = valX;
            this.mesh.material.uniforms.yval.value = valY;
            this.mesh.material.uniforms.zval.value = valZ;
            this.mesh.material.needsUpdate = true;
        }
    },

    handleVolumeSliderChange: function(event)
    {
        this.g.mesh.material.uniforms.luminosity.value = parseFloat($("#luminosityControls").val());
        this.g.mesh.material.uniforms.opacity.value = parseFloat($("#opacityControls").val());
        this.g.mesh.material.needsUpdate  = true;
    },

    handlePlaneSliderChange: function(which, event)
    {
        var plane = this.planes[which];

        // The use of 'which' as an indexer here is super hacky. It could easily fail at some point
        //   rectangle.position is a THREE JS datastructure, not a StochSS one
        plane.rectangle.position[which] = plane.slider.val();
        plane.uniforms.val.value = plane.slider.val();
        this.mesh.material.needsUpdate = true;
        plane.rectangle.geometry.verticesNeedUpdate = true;
        //plane.edges.position[which] = plane.slider.val();
        //plane.edges.geometry.verticesNeedUpdate = true;
    },

    handleVisibleCheckboxClick : function(which, event)
    {
        var plane = this.planes[which];

        var checkbox = plane.visibleCheckbox; // Should also be available as $( event.target )

        plane.edges.visible = checkbox.is(':checked');
        
        plane.uniforms.flag.value = checkbox.is(':checked') * 1.0; // Cast boolean to float
        this.mesh.material.needsUpdate = true;

        //TODO: Fix for volume rendering
        //plane.uniforms.flag.value = checkbox.is(':checked') * 1.0;
        //this.g.mesh.material.needsUpdate = true;
    },

    deleteCache : function(start1, stop1)
    {
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

    replaceCache : function(stime1, etime1, stime2, etime2)
    {
        console.log("replaceCache : function("+stime1+","+stime2+")");
        this.deleteCache(stime1, etime1);
        this.updateCache(stime2, etime2);
    },

    updateCache : function(start1, stop1, colorFlag)
    {
        var start = start1;
        var stop = Math.min(stop1, this.maxLimit);

        if(start > stop)
            return;

        console.log(" updateCache : function("+start+", "+stop+")");

        if(!this.webGLWorks())
        {
            console.log('WebGL not working. Short circuiting ajax calls');
            return;
        }

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
                          if(_.has(data, "status") && !data.status)
                          {
                              this.updateMsg( { status : false, msg : data.msg }, "meshMsg" );
                              return;
                          }

                          if(typeof(data.colors) == 'undefined')
                              return
                          
                          keys = _.keys(data.colors).map(function(item) {
                              return parseInt(item, 10);
                          });

                          var time = keys.sort();

                          if(time.length == 0)
                              return
                          for (var i = 0; i < time.length; i++) {
                              var t = time[i]; 
                              this.cache[t] = { colors : data.colors[t],
                                                raw : data.raw[t] };
                          }

                          // console.log("Are both colors the same ? ", this.compare(this.cache[0], this.cache[49]));

                          this.limits = data.limits;

                          this.m2texLow.minv = this.limits[this.selectedSpecies].min;
                          this.m2texLow.maxv = this.limits[this.selectedSpecies].max;

                          if(this.showPopulation)
                          {
                              $("#maxVal").html("Maximum voxel population: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                              $("#minVal").html("Minimum voxel population: " + this.limits[this.selectedSpecies]["min"].toExponential(3) ); 
                          } else {
                              $("#maxVal").html("Maximum voxel concentration: " + this.limits[this.selectedSpecies]["max"].toExponential(3) );
                              $("#minVal").html("Minimum voxel concentration: " + this.limits[this.selectedSpecies]["min"].toExponential(3));  
                          }

                          this.handleMeshColorUpdate(this.cache[this.timeIdx]);

                          if(!this.rendererInitialized)
                          {
                              this.rendererInitialized = true;
                              this.renderLoop();
                          }

                      }
                      catch(err)
                      {
                          this.updateMsg( { status : false, msg : 'Error retrieving time series data from server: ' + err.message}, "meshMsg" );
                      }
                  }, this)
                });
    },

    handleGetMesh : function(data) {
        try {
            if(_.has(data, "status") && !data.status)
            {
                this.updateMsg( { status : false, msg : data.msg }, "meshMsg" );
                return;
            }
            
            $( '#speciesSelect' ).empty();
            this.data = data;

            var loader = new THREE.JSONLoader();
            var geometry = loader.parse(data.mesh).geometry;
        
            var minx = geometry.vertices[0].x;
            var maxx = minx;
            var miny = geometry.vertices[0].y;
            var maxy = miny;
            var minz = geometry.vertices[0].z;
            var maxz = minz;
            
            for(var i = 0; i < geometry.vertices.length; i++)
            {
                var x = geometry.vertices[i].x;
                var y = geometry.vertices[i].y; 
                var z = geometry.vertices[i].z; 
                
                minx = ( minx > x ? x: minx );    
                maxx = ( maxx < x ? x: maxx );
                
                miny = ( miny > y ? y: miny );    
                maxy = ( maxy < y ? y: maxy );
                
                minz = ( minz > z ? z: minz );    
                maxz = ( maxz < z ? z: maxz );
            }
            
            this.boundingBox = {
                x : { min : minx, max : maxx },
                y : { min : miny, max : maxy },
                z : { min : minz, max : maxz }
            };

            this.geometry = geometry;

            $( '#plotRegion' ).show();

            this.constructRenderer();
            this.constructControls();

            this.updateCache(0, this.cacheRange);
        }
        catch(err)
        {
            this.updateMsg( { status : false, msg : 'Error retrieving mesh from server: ' + err.message} ,"meshMsg");
        }
        
    },

    acquireNewData : function()
    {
        // If cache is available
        if(this.cache[this.timeIdx] && this.meshData)
        {
            this.handleMeshColorUpdate(this.cache[this.timeIdx]); 
        }
        else
        {
            if(!this.playFlag)
                $( "#meshPreviewMsg" ).show();
            
            // If mesh is available
            if(this.meshData)
            {
                var start  = this.timeIdx ;
                var end = (this.timeIdx + this.cacheRange);
                this.updateCache(start, end, true);
                $( "#meshPreviewMsg" ).hide();
            }
            // Neither cache or mesh available
            else
            {
            }
        }
    },
    
    changeTime : function(time)
    {
        this.timeIdx = time;

        $( '#timeSelect' ).val(time);
        $( '#timeSelectDisplay' ).text('Time: ' + time);   
        
        this.acquireNewData();
    },

    // This function is called when the slider changes values
    //   Because we only want it to do something when the user changed the slider value, we check for originalEvent
    //   Other pieces of code (the function above) can trigger the event but we don't want them to do anything
    handleTimeChange : function(event)
    {
        var isRace = false;

        if(event && event.originalEvent)
        {
            // To prevent race conditions during animation
            if(this.playFlag)
            {
                this.playFlag = false;
                isRace = true;
            }

            var slider = $( event.target );
            $( '#timeSelectDisplay' ).text('Time: ' + slider.val())
            this.timeIdx = Math.round( slider.val() / slider.prop('step') );

            // After the slider reset is over we can animate again
            if(isRace)
            {
                this.playFlag = true;
            }

            this.acquireNewData();
        }
    },

    handleMeshColorUpdate : function(cache)
    {
        var val = $( '#speciesSelect' ).val();

        if(this.volumeRender)
        {
            this.updateVolumeRenderData(cache.raw[val]);
        }
        else
        {
            this.redrawColors(cache.colors[val]);
        }
    },

    redrawColors : function(colors) {
        colors2 = [];
        for(var i = 0; i < this.mesh.geometry.faces.length; i++)
        {
            var faceIndices = ['a', 'b', 'c'];         
            var face = this.mesh.geometry.faces[i];   
            
            // assign color to each vertex of current face
            for( var j = 0; j < 3; j++ )  
            {
                var vertexIndex = face[ faceIndices[ j ] ];
                face.vertexColors[ j ] = new THREE.Color(colors[vertexIndex]); //new THREE.Color("rgb(" + Math.floor(Math.random() * 255) + ", 0, 0)");//
            }
            
        }
        this.mesh.material.needsUpdate = true;
        this.mesh.geometry.colorsNeedUpdate = true;
    },

    handleSpeciesSelect : function(event)
    {
        var species = $( event.target ).val();

        this.selectSpecies(species);
    },

    selectSpecies : function(species)
    {
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

        if(typeof(this.cache[this.timeIdx]) != 'undefined')
        {
            this.handleMeshColorUpdate(this.cache[this.timeIdx]);
        }
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

        this.cache = {};

        this.acquireNewData();
    },

    loadTextFile: function(url) {
        var result;
        
        $.ajax({
            url:      url,
            type:     "GET",
            async:    false,
            dataType: "text",
            success:  function(data) {
                result = data;
            }
        });
        
        return result;
    },

    updateVolumeRenderData : function(raw) {
        $( '#volumeControls' ).show();
        
        var texture = new THREE.DataTexture(this.m2texLow.generateTexture(raw), this.m2texLow.texWidth, this.m2texLow.texHeight, THREE.RGBAFormat);
        
        this.displayVolume(texture);
    },

    displayVolume: function(texture){
        console.log("Displaying Volume...");
        
        g = {};
        g.width = Math.floor(this.d_width); g.height = Math.floor(this.d_height);
        g.scene = new THREE.Scene();

        //g.colorTex = THREE.ImageUtils.loadTexture("/static/img/jet.png");
        //g.colorTexDim =  new THREE.Vector3(347.0, 16.0, 0.0);

        g.voltex = texture;//new THREE.Texture(imdata);
        g.voltex.needsUpdate = true;
        g.voltex.wrapS = g.voltex.wrapT = THREE.ClampToEdgeWrapping;

        var Nx = this.m2texLow.Nx;
        var Ny = this.m2texLow.Ny;
        var Nz = this.m2texLow.Nz;

        g.volcol = new THREE.Vector3(1.0, 1.0, 1.0);
        g.voltexDim = new THREE.Vector3(Nx, Ny, Nz);

        this.luminosity = parseFloat($("#luminosityControls").val());
        this.opacity = parseFloat($("#opacityControls").val());

        var radius = this.geometry.boundingSphere.radius;

        g.uniforms = {
            xval : { type: 'f', value: -radius }, 
            yval : { type: 'f', value: -radius }, 
            zval : { type: 'f', value: -radius },
            xflag : { type: 'f', value: 0.0 },
            yflag : { type: 'f', value: 0.0 }, 
            zflag : { type: 'f', value: 0.0 },
            xflip : { type: 'f', value: 1.0 },
            yflip : { type: 'f', value: 1.0 }, 
            zflip : { type: 'f', value: 1.0 },
            uCamPos:    { type: "v3", value: this.camera.position },
            uColor:     { type: "v3", value: g.volcol },
            uTex:       { type: "t", value: g.voltex },
            Nx:       { type: "f", value: Nx },
            Ny:       { type: "f", value: Ny },
            Nz:       { type: "f", value: Nz },
            width:       { type: "f", value: this.m2texLow.texWidth },
            height:       { type: "f", value: this.m2texLow.texHeight },
            uTexDim:    { type: "v3", value: g.voltexDim },
            uTMK:       { type: "f", value: 10.0 },
            luminosity:  { type: "f", value: this.luminosity },
            opacity: { type:"f", value: this.opacity }
        };

        shader = new THREE.ShaderMaterial({
            uniforms:       g.uniforms,
            vertexShader:   this.loadTextFile( '/static/shaders/vol-vs.glsl' ), 
            fragmentShader: this.loadTextFile( '/static/shaders/vol-fs.glsl' ),
            transparent: true,
        });

        var maxDim = Math.max(Nx, Ny, Nz);

        var geometry = new THREE.BoxGeometry( Nx / maxDim, Ny / maxDim, Nz / maxDim );
        g.mesh = new THREE.Mesh( geometry , shader);
        g.scene.add( g.mesh ); 

        g.scene.add(planeX);
        g.scene.add(planeXEdges);
        g.scene.add(planeY);
        g.scene.add(planeYEdges);
        g.scene.add(planeZ);
        g.scene.add(planeZEdges);

        this.g = g;
    },

    render : function(data)
    {
        if(typeof data != 'undefined')
        {
            this.jobInfo = data;
            
            this.cacheRange =  (this.jobInfo.indata.time < 50) ? this.jobInfo.indata.time : 50;

            var jobInfoTemplate = _.template( $( "#jobInfoTemplate" ).html() );

            $( "#jobInfo" ).html( jobInfoTemplate(this.jobInfo) )

            $( "#accessOutput" ).show();
            // Add event handler to access button
            if ((data['resource'] == 'ec2-cloud' || data['resource'] == 'flex-cloud') && !data['outData'])
            {
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
            
            console.log("meshDataPreview : function(data)");
            if (!window.WebGLRenderingContext) {
                // Browser has no idea what WebGL is. Suggest they
                // get a new browser by presenting the user with link to
                // http://get.webgl.org
                $( "#plotRegion" ).html('<center><h2 style="color: red;">Error: WebGL Not Supported</h2><br /> \
<ul><li>Download an updated Firefox or Chromium to use StochSS (both come with WebGL support)</li> \
<li>It may be necessary to update system video drivers to make this work</li></ul></center>');
                $( '#plotRegion' ).show();
                return;
            }

            if (!this.webGLWorks()) {
                // Browser could not initialize WebGL. User probably needs to
                // update their drivers or get a new browser. Present a link to
                // http://get.webgl.org/troubleshooting
                $( "#plotRegion" ).html('<center><h2 style="color: red;">Error: WebGL Disabled</h2><br /> \
<ul><li>In Safari and certain older browsers, this must be enabled manually</li> \
<li>Browsers can also throw this error when they detect old or incompatible video drivers</li> \
<li>Enable WebGL, or try using StochSS in an up to date Chrome or Firefox browser</li> \
</ul></center>');
                $( '#plotRegion' ).show();
                return false;
            }

            if(typeof data.status != 'undefined')
            {
                updateMsg( data );
                
                if(!data.status)
                    return;
            }
            
            if(data['jobStatus'] == 'Finished' && data['complete'] == 'yes' )
            {
                $.ajax( {
                    type : "GET",
                    url : "/spatial",
                    data : { reqType : "timeData", 
                             id : this.attributes.id, 
                             data : JSON.stringify( {
                                 trajectory : this.trajectory,
                                 timeIdx : this.timeIdx })
                           },
                    success : _.bind(this.handleGetMesh, this)
                } );
            }
            else
            {
                $( '#error' ).show();
            }
        }
    },
    
    constructControls : function()
    {
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
        slider.on('change', _.throttle(_.bind(this.handleTimeChange, this), 1000));
        this.changeTime(this.timeIdx);

        // Set up species selector
        var speciesSelect = $("#speciesSelect");

        var sortedSpecies = this.data.species.sort();

        for(var i in sortedSpecies) {
            var specie = sortedSpecies[i];

            var input = $( '<option value="' + specie + '">' + specie + '</option>' ).appendTo( speciesSelect );

            // Select default
            if(typeof this.selectedSpecies === 'undefined')
            {
                this.selectedSpecies = specie;
            }
        }

        speciesSelect.off('change');
        speciesSelect.on('change', _.bind(this.handleSpeciesSelect, this));

        this.selectSpecies(this.selectedSpecies);

        // Set up radio buttons
        var wireSelect = $("#wireSelect");
        wireSelect.change(_.bind(function(){
            console.log('unitSelect.click');
            selectedIndex =  $("#wireSelect")[0].options["selectedIndex"]
            selectedOption = $("#wireSelect")[0].options[selectedIndex].value
            if( selectedOption == 'solid')
            {
                this.volumeRender = false;
                this.mesh.material.wireframe = false;
                this.mesh.material.needsUpdate = true;
            }
            else if( selectedOption == 'wireframe')
            {
                this.volumeRender = false;
                this.mesh.material.wireframe = true;
                this.mesh.material.needsUpdate = true;
            }
            else if(selectedOption == 'volume')
            {
                this.updateVolumeRenderData(this.cache[this.timeIdx].raw[this.selectedSpecies]);
                this.volumeRender = true;
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
                this.updateMsg( { status : false, msg : "Warning: the population plot is not normalized to volume. Interpretation of this plot can be misleading" }, 'meshMsg' );
            }
            else if( selectedOption == 'concentration')
            {
                this.showPopulation  = false;
                this.updateMsg( { status : true, msg : "" }, 'meshMsg' );
            }
            
            this.cache = {}
            this.updateCache(this.timeIdx, this.timeIdx + this.cacheRange, true);
        }, this));

        this.planes['x'].visibleCheckbox = $( '#planeXCheck' );
        this.planes['x'].flipCheckbox = $( '#planeXFlip' );
        this.planes['x'].slider = $( '#planeXSlider' );
        this.planes['y'].visibleCheckbox = $( '#planeYCheck' );
        this.planes['y'].flipCheckbox = $( '#planeYFlip' );
        this.planes['y'].slider = $( '#planeYSlider' );
        this.planes['z'].visibleCheckbox = $( '#planeZCheck' );
        this.planes['z'].flipCheckbox = $( '#planeZFlip' );
        this.planes['z'].slider = $( '#planeZSlider' );

        for(var which in this.planes)
        {
            var plane = this.planes[which];

            plane.visibleCheckbox.click(_.bind(_.partial(this.handleVisibleCheckboxClick, which), this));
            plane.flipCheckbox.click(_.bind(_.partial(this.handleFlipCheckboxClick, which), this));

            var min = this.boundingBox[which].min,
            max = this.boundingBox[which].max;

            var slider = plane.slider;

            slider.prop('min', min);
            slider.prop('max', max);
            slider.val(min);
            slider.prop('step', (max - min) / 20);
            slider.on('change', _.throttle(_.bind(_.partial(this.handlePlaneSliderChange, which), this), 1000));
        }            

        var slider = $("#luminosityControls");
        slider.on('change', _.throttle(_.bind(this.handleVolumeSliderChange, this), 1000));

        var slider = $("#opacityControls");
        slider.on('change', _.throttle(_.bind(this.handleVolumeSliderChange, this), 1000));

        $("#playSpeed").html( (1000/ this.playMeshInterval).toFixed(2) );

        $( '.controls' ).show();
        $( '#meshPreviewMsg' ).hide();
    }
});

var run = function()
{
    var id = $.url().param("id");
    var cont = new Spatial.Controller( { id : id } );
}
