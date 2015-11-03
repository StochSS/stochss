var Volume = Volume || {}

Volume.Controller = Backbone.View.extend(
    {
        el : $("#jobInfo"),

        initialize : function(attributes)
        {
            this.attributes = attributes;
            this.jobInfo = undefined;
            this.meshData = undefined;
            this.timeIdx = 0;
            this.selectedSpecies = undefined;
            this.trajectory = 0;
            this.getJobInfo();
        },

        getJobInfo : function()
        {
            $.ajax( { url : '/spatial',
            type : 'GET',
            reqType : 'json',
            data : { 'reqType' : 'getJobInfo',
            'id' : this.attributes.id },
            success : _.bind(this.getMeshInfo, this) } );
        },

        getMeshInfo : function() {
            $.when($.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData", 
                               id : this.attributes.id, 
                               data : JSON.stringify( {
                                   trajectory : 0,
                                   timeIdx : 5 })
                             } 
                           }
                         ),
                   $.ajax( { type : "GET",
                             url : "/spatial",
                             data : { reqType : "onlyColorRange",
                                      id : this.attributes.id,
                                      data : JSON.stringify( {
                                          showPopulation : true,
                                          trajectory : 0,
                                          timeStart : 4,
                                          timeEnd: 4 } )
                                    }
                           }
                         )
                  ).done( _.bind( this.getMeshHandler, this ) );
        },

        getMeshHandler : function(meshData, colorData) {
            this.model = meshData;
            var mesh = meshData[0].mesh;
            this.species = meshData[0].species;
            this.voxelTuples = meshData[0].voxelTuples;
            this.colors = colorData[0].colors[4];
            this.mesh = new THREE.JSONLoader().parse(mesh);

            console.log("calling this.setLimitHelper();")
            this.setLimitHelper();

             console.log("calling this.constructGridHelper();")
            this.constructGridHelper();

            console.log("calling this.constructInverseMap();")
            this.constructInverseMap();

            console.log("calling this.constructBaryMap();")
            this.constructBaryMap();

            console.log("calling this.constructImage();")
            var image = this.constructImage();

            console.log("calling this.getTexture");
            var canvasData = this.displayTexture(image);
            
            console.log("calling this.displayVolume");
            this.displayVolume(canvasData);
            //this.mousetrap();

            console.log("exit");
        },

        setLimitHelper: function(){
            var vertices = this.mesh.geometry.vertices;
            this.minx = vertices[0].x;
            this.maxx = vertices[0].x;

            this.miny = vertices[0].y;
            this.maxy = vertices[0].y;

            this.minz = vertices[0].z;
            this.maxz = vertices[0].z;

            for(var i=0; i<vertices.length; i++)
            {
              var x = vertices[i]['x'];
              var y = vertices[i]['y'];
              var z = vertices[i]['z'];
              if(this.minx > x)
                this.minx = x;
              if(this.maxx < x)
                this.maxx = x;

              if(this.miny > y)
                this.miny = y
              if(this.maxy < y)
                this.maxy = y;

              if(this.minz > z)
                this.minz = z;
              if(this.maxz < z)
                this.maxz = z;
            } 

            this.texWidth = 1024;
            this.texHeight = 1024; 
            var xrange = (this.maxx- this.minx);
            var yrange = (this.maxy - this.miny);
            var zrange = (this.maxz - this.minz);
            
            var i = 1;
            for(i = this.texWidth; i > 0; i--)
            {
              var Nx = i;
              var Ny = Math.floor(Nx * yrange / xrange);
              var Nz = Math.floor(Nx * zrange / xrange);
              var horizontal = Math.floor(this.texWidth/Nx);
              var vertical = Math.floor(this.texHeight/Ny);
              if((horizontal * vertical)> Nz) break;
            }

            this.Nx = i+1;
            this.Ny = Math.floor(this.Nx * yrange / xrange);
            this.Nz = Math.floor(this.Nx * zrange / xrange);

            var horizontal = Math.floor(this.texWidth / this.Nx);
            var vertical = Math.floor(this.texHeight / this.Ny);

            this.texWidth = horizontal * this.Nx;
            this.texHeight = this.Ny * Math.ceil(this.Nz / horizontal);
        },

        getKeyFromGrid: function(x, y, z){
            N = 20;
            ix = parseInt( (  ( (x - this.minx)  * N ) / (this.maxx + 1e-5 - this.minx)  ) ) ;
            iy = parseInt( (  ( (y - this.miny)  * N ) / (this.maxy + 1e-5  - this.miny) ) ) ;
            iz = parseInt( (  ( (z - this.minz)  * N ) / (this.maxz + 1e-5 - this.minz)  ) );
            return new Array(ix, iy, iz);
        },

        constructGridHelper: function(){
          N = 20;
          this.grid = new TupleDictionary();

          for(var idx=0; idx < this.voxelTuples.length; idx++){
              var tuples = this.voxelTuples[idx];
              
              var voxelCoords = [];
              var xs = []; var ys =[]; var zs = [];
              for(var i=0; i<4; i++)
              {
                vertices = this.mesh.geometry.vertices[tuples[i]];
                xs[i] = vertices['x'];
                ys[i] = vertices['y'];
                zs[i] = vertices['z'];
                voxelCoords[i] = this.mesh.geometry.vertices[tuples[i]];
              }

              Array.max = function( array ){
                  return Math.max.apply( Math, array );
              };
               
              Array.min = function( array ){
                  return Math.min.apply( Math, array );
              };


              var vminx = Array.min(xs);
              var vmaxx = Array.max(xs);
              var vminy = Array.min(ys);
              var vmaxy = Array.max(ys);
              var vminz = Array.min(zs);
              var vmaxz = Array.max(zs);
              
              var dx = (this.maxx - this.minx) / N
              var dy = (this.maxy - this.miny) / N
              var dz = (this.maxz - this.minz) / N
              
              var ixlimit = Math.ceil( (vmaxx - vminx) / dx ) + 1
              var iylimit = Math.ceil( (vmaxy - vminy) / dy ) + 1
              var izlimit = Math.ceil( (vmaxz - vminz) / dz ) + 1 
              
              for(var ix=0; ix<ixlimit; ix++){
                  for(var iy=0; iy<iylimit; iy++){
                      for(var iz=0; iz<izlimit; iz++){
                        var xcoord = Math.min(vminx + dx * ix, vmaxx);
                        var ycoord = Math.min(vminy + dy * iy, vmaxy);
                        var zcoord = Math.min(vminz + dz * iz, vmaxz);
                        var key = this.getKeyFromGrid(xcoord, ycoord, zcoord);

                        this.grid.put( key , idx );           
                    } 
                  } 
              }
                          

          }
        },


        constructInverseMap: function(){
          this.inverseMap = {}

          for(var idx=0; idx < this.voxelTuples.length; idx++){
              var tuples = this.voxelTuples[idx];
          
              var voxelCoords = [];
              var xs = []; var ys =[]; var zs = [];
              for(var i=0; i<4; i++)
              {
                voxelCoords[i] = this.mesh.geometry.vertices[tuples[i]];
              }

              var matrix =  this.getMatrix( voxelCoords );
              this.inverseMap[idx] = new Array();
              this.inverseMap[idx].push(this.getInverse(matrix));
              this.inverseMap[idx].push(voxelCoords[3]);
          }
        },

        getMatrix : function(voxelCoords)
        {
          v1 = voxelCoords[0]
          v2 = voxelCoords[1]
          v3 = voxelCoords[2]
          v4 = voxelCoords[3]
          
          result = []
          result.push( [ v1['x'] - v4['x'], v2['x'] - v4['x'],  v3['x'] - v4['x'] ] ) 
          result.push( [ v1['y'] - v4['y'], v2['y'] - v4['y'],  v3['y'] - v4['y'] ] ) 
          result.push( [ v1['z'] - v4['z'], v2['z'] - v4['z'],  v3['z'] - v4['z'] ] ) 
          return result
        },

        getInverse : function(A){
            var d1 = A[0][0]*( A[1][1]*A[2][2]-A[2][1]*A[1][2] )
            var d2 = A[0][1]*( A[1][0]*A[2][2]-A[1][2]*A[2][0] )
            var d3 = A[0][2]*( A[1][0]*A[2][1]-A[1][1]*A[2][0] )
            determinant = d1 - d2 + d3
            
            if(determinant == 0){
                console.log("Error in determinant");
                determinant = 1
              }
                
            var invdet = 1/determinant;
            
            var inverse = []

            var e1 =  (A [1][1]*A[2][2]-A[2][1]*A[1][2])*invdet
            var e2 = -(A [0][1]*A[2][2]-A[0][2]*A[2][1])*invdet
            var e3 =  (A [0][1]*A[1][2]-A[0][2]*A[1][1])*invdet
            inverse.push([e1, e2, e3])
            
            e1 = -(A[1][0]*A[2][2]-A[1][2]*A[2][0])*invdet
            e2 =  (A[0][0]*A[2][2]-A[0][2]*A[2][0])*invdet
            e3 = -(A[0][0]*A[1][2]-A[1][0]*A[0][2])*invdet
            inverse.push([e1, e2, e3])
            
            
            e1 =  (A[1][0]*A[2][1]-A[2][0]*A[1][1])*invdet
            e2 = -(A[0][0]*A[2][1]-A[2][0]*A[0][1])*invdet
            e3 =  (A[0][0]*A[1][1]-A[1][0]*A[0][1])*invdet
            inverse.push([e1, e2, e3])

            return inverse
        },

        constructBaryMap: function(){
          var xlimit = this.Nx;
          var ylimit = this.Ny;
          var zlimit = this.Nz;
          this.list = []
          this.baryMap = {}
          for (var x=0; x<xlimit; x++)
          {
            for(var y=0; y<ylimit; y++)
            {
              for(var z=0; z<zlimit; z++)
              {
                var a_x = ((x / (xlimit-1)) * (this.maxx - this.minx) + this.minx);
                var a_y = ((y / (ylimit-1)) * (this.maxy - this.miny) + this.miny);
                var a_z = ((z / (zlimit-1)) * (this.maxz - this.minz) + this.minz);
                var key  = this.getKeyFromGrid(a_x,a_y,a_z);
                var keys = this.grid.get(key);
                var inval = 0;
                result = [];
                if(typeof(keys) != "undefined")
                { 
                  var akeys = Array.from(keys);
                  for(var i=0; i<akeys.length; i++)
                  {
                    result = this.baryCalc(akeys[i], [a_x, a_y, a_z]);
                    if (result != -1)
                        this.list.push({ x : x, y : y, z : z, result : result, voxelKey : akeys[i] });
                  }
                }
              }
            }
          }
        },

        baryCalc: function(key, r){
          var inval = 0;
          inmatrix= this.inverseMap[key][0];
          r4 =  [this.inverseMap[key][1].x, this.inverseMap[key][1].y, this.inverseMap[key][1].z];
          var flag = true;

          var val = [r[0] - r4[0], r[1] - r4[1], r[2] - r4[2]];
          var s = 0;
          var result = [0.0, 0.0, 0.0];

          for(var i=0; i< 3; i++)
          {
            for(var j=0; j< 3; j++)
              {
                result[i] += inmatrix[i][j] * val[j];
              }
          }

          for(var i = 0; i < 3; i++)
          {
            s += result[i];
            if (result[i] < 0.0 || result[i] > 1)
              result = -1;
          }
          
          if ((1.0 + 1e-8) < s)
            result= -1;

          return result;
        },

        constructImage: function(){
          var xlimit = this.Nx;
          var ylimit = this.Ny;
          var zlimit = this.Nz;
          
          var im = new Array(xlimit*ylimit*zlimit).fill(0);
          var data = this.colors["A"];
          for(var i = 0; i < this.list.length; i++)
          {
            var x = this.list[i].x;
            var y = this.list[i].y;
            var z = this.list[i].z;
            var result = this.list[i].result;
            var k = this.list[i].voxelKey;

            var v1 =this.voxelTuples[k][0];
            var v2 =this.voxelTuples[k][1];
            var v3 =this.voxelTuples[k][2];
            var v4 =this.voxelTuples[k][3];
              
            var c1 = data[v1]
            var c2 = data[v2]
            var c3 = data[v3]
            var c4 = data[v4]
              
            var l1 =  result[0];
            var l2 = result[1];
            var l3 = result[2];
            var l4 = Math.max(0.0, 1 - (l1 + l2 + l3))
              
            var inval = l1 * c1 + l2 * c2 + l3 * c3 + l4 * c4

            im[(x*ylimit*zlimit)+(y*zlimit)+z] = inval;
            
          }
          return im;
        },

        constructTexture: function(imdata, ctx, width, height)
        {
            var min = _.min(imdata);
            var max = _.max(imdata);

            for(var i = 0; i < imdata.length; i++)
              imdata[i] = (imdata[i] - min) / (max - min);

            var tgtData = ctx.createImageData(width, height);
            for(var i = 0; i < width; i++)
            {
              for(var j = 0; j < height; j++)
              {
                tgtData.data[4 * (j * width + i)] = 0;
                tgtData.data[4 * (j * width + i) + 1] = 0;
                tgtData.data[4 * (j * width + i) + 2] = 255;
                tgtData.data[4 * (j * width + i) + 3] = 255;
              }
            }

            var idx = 0;
            var tiles = Math.floor(width / this.Nx);

            for(var z = 0; z < this.Nz ; z++)
            {
              for(var i = 0; i < this.Nx; i++)
              {
                for(var j = 0; j < this.Ny; j++)
                {
                      color1 = Math.floor(imdata[i*this.Ny * this.Nz+ j*this.Nz +z] * 255); 
                      color2 = Math.floor(imdata[i*this.Ny * this.Nz+ j*this.Nz +z] * 255);
                      color3 = 0;
                      var idx = (i + j * width+ (z % tiles)* this.Nx);
                      var rownum = Math.floor(z / tiles);
                      idx += rownum* this.Ny* width ;
                      tgtData.data[ 4 * idx] = color1;
                      tgtData.data[ 4 * idx + 1] = color2;
                      tgtData.data[ 4 * idx + 2] = color3;
                      tgtData.data[ 4 * idx + 3] = 255;
                  }
              }              
            }
            return tgtData;
        },

        displayTexture : function(imdata)
        { 
            var tgtCanvas = $( '#tgtCanvas' ).get(0);
            $( tgtCanvas ).prop('width', this.texWidth).prop('height', this.texHeight);
            var tgtCtx = tgtCanvas.getContext('2d');
            var tgtData = this.constructTexture(imdata, tgtCtx, this.texWidth, this.texHeight);
            tgtCtx.putImageData(tgtData, 0, 0);
            return tgtCanvas;
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


        displayVolume : function(imdata)
        {
          g = {}
          g.width =1000; g.height = 768;
          
          g.scene = new THREE.Scene();

          g.camera = this.constructCamera(g.width, g.height);

          g.camera.position.set(0, 0, -2);
          g.camera.lookAt(new THREE.Vector3());      
          
          g.renderer = this.constructRenderer(g.width, g.height);
          g.colorTex = THREE.ImageUtils.loadTexture("/static/img/jet.png");
          g.colorTex.minFilter = g.colorTex.magFilter = THREE.LinearFilter;
          g.colorTex.wrapS = g.colorTex.wrapT = THREE.ClampToEdgeWrapping;
          g.colorTexDim =  new THREE.Vector3(347.0, 16.0, 0.0);

          //var imdata = THREE.ImageUtils.loadTexture( '/static/images/download1.png' );
          g.voltex =  new THREE.CanvasTexture( imdata );//imdata; //
          g.voltex.wrapS = g.voltex.wrapT = THREE.ClampToEdgeWrapping;

          g.voltex2 = imdata; // imdata );
          g.voltex2.wrapS = g.voltex2.wrapT = THREE.ClampToEdgeWrapping;
          g.volcol = new THREE.Vector3(1.0,1.0, 1.0);
          g.voltexDim = new THREE.Vector3(this.Nx, this.Ny, this.Nz);
          //g.offset = new THREE.Vector3(0.0, 0.0,0.0);

          g.rtTexture = new THREE.WebGLRenderTarget( g.width, g.height, { minFilter: THREE.LinearFilter,
                                                                        magFilter: THREE.NearestFilter,
                                                                        format: THREE.RGBAFormat } );
          
          g.uniforms = {
              uCamPos:    { type: "v3", value: g.camera.position },
              uColor:     { type: "v3", value: g.volcol },
              uTex:       { type: "t", value: g.voltex },
              Nx:       { type: "f", value: this.Nx },
              Ny:       { type: "f", value: this.Ny },
              Nz:       { type: "f", value: this.Nz },
              width:       { type: "f", value: this.texWidth },
              height:       { type: "f", value: this.texHeight },
              //depthTex:   { type: "t", value: g.rtTexture },
              uTexDim:    { type: "v3", value: g.voltexDim },
              uTex2:      { type: "t", value: g.voltex2 },
              colorTex:   { type: "t", value : g.colorTex },
              colorTexDim:{ type: "v3", value: g.colorTexDim },
              uTMK:       { type: "f", value: 10.0 }
          };

          shader = new THREE.ShaderMaterial({
              uniforms:       g.uniforms,
              vertexShader:   this.loadTextFile( '/static/shaders/vol-vs.glsl' ), 
              fragmentShader: this.loadTextFile( '/static/shaders/vol-fs.glsl' ),
              //depthWrite: false,
              transparent: true,
              //side: THREE.DoubleSide
          });

          var maxDim = Math.max(this.Nx, this.Ny, this.Nz);

          var geometry1 = new THREE.BoxGeometry(this.Nx / maxDim, this.Ny / maxDim, this.Nz / maxDim);
          g.mesh1 = new THREE.Mesh( geometry1, shader);// new THREE.MeshNormalMaterial());
          g.scene.add( g.mesh1 );    


          g.controls = new THREE.TrackballControls( g.camera);
          g.controls.rotateSpeed = 1.0;
          g.controls.zoomSpeed = 0.2;
          g.controls.panSpeed = 0.8;
          g.controls.noZoom = false;
          g.controls.noPan = false;
          g.controls.staticMoving = true;
          g.controls.dynamicDampingFactor = 0.8;
          g.controls.keys = [ 65, 83, 68 ];
          g.controls.radius = ( g.width + g.height ) / 4;

          this.g = g;
          this.render(); 
          this.animate();
        },

        animate : function() {
          requestAnimationFrame( _.bind(this.animate, this) );
          this.g.controls.update();
          this.g.renderer.render( this.g.scene, this.g.camera );

        },

        constructRenderer: function(width, height)
        {
          var renderer = new THREE.WebGLRenderer({antialias: true});
          renderer.setClearColor( 0xffffff, 1.0 );
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setSize( width, height );
          renderer.sortObjects = false;
          return renderer;
        },

        constructCamera: function(width, height){
          var c = {};
          c.CAM_FOV  = 45;
          c.CAM_NEAR = 1;
          c.CAM_FAR  = 200; 
          return new THREE.PerspectiveCamera( c.CAM_FOV, width/height, c.CAM_NEAR, c.CAM_FAR);      
        },

        render: function(g)
        {
          var container = document.getElementById("container");
          container.appendChild( this.g.renderer.domElement );
          this.g.renderer.render( this.g.scene, this.g.camera );
        },
  });

var run = function()
{
    var id = $.url().param("id");
    var cont = new Volume.Controller( { id : id } );
}

function TupleDictionary() {
  this.dict = {};
}

TupleDictionary.prototype = {
 tupleToString: function(tuple) {
  return tuple.join(",");
 },

 put: function(tuple, val) {
  key = this.tupleToString(tuple)
  
  if(key in this.dict){;}
  else{  this.dict[key] = new Set(); }

  this.dict[ key ].add(val);

  },

 get: function(tuple) {
  return this.dict[ this.tupleToString(tuple) ];
 }
};

$( document ).ready( run );
