var Volume = Volume || {}

Volume.Controller = Backbone.View.extend(
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
            this.refreshData();
        },

        refreshData : function()
        {
            $.ajax( { url : '/spatial',
            type : 'GET',
            reqType : 'json',
            data : { 'reqType' : 'getJobInfo',
            'id' : this.attributes.id },
            success : _.bind(this.getMesh, this) } );
        },

        getMesh : function() {
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
                  ).done( _.bind( this.getMeshVoxelData, this ) );
        },


        getMeshVoxelData : function(a1, a2) {
            var mesh = a1[0].mesh;
            this.species = a1[0].species;
            this.colors = a2[0].colors[4];


            var loader = new THREE.JSONLoader();
            this.mesh = loader.parse(mesh);
            
            this.voxelTuples = a1[0].voxelTuples;
            console.log("mesh is "+mesh);

            var start = new Date().getTime();
            
            this.initLimits();

            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.initLimits();' + time);
            
            
            var start = new Date().getTime();
            
            this.getKey(0., 0., 0.);
            
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.getKey(0., 0., 0.);' + time);


            var start = new Date().getTime();
            
            this.makeGrid();
            
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.makeGrid();' + time);


            var start = new Date().getTime();
            
            this.makeInverseMap();
            
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.makeInverseMap();' + time);

            this.N = 100;

            var start = new Date().getTime();
            
            this.precalculateBaryCalc();
            
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.precalculateBaryCalc();' + time);

            var start = new Date().getTime();
            // console.log(this.baryCalc([50, 250, 370, 473, 1058, 1297, 1337, 1359, 1572, 1591, 1768, 1847, 1877, 1965, 2029, 2065, 2189, 2201, 2210, 2246, 2495, 2518, 2535, 2548, 2583, 2600, 2629, 2728, 2798, 3037, 3054, 3100, 3238, 3256, 3258, 3261, 3262, 3389, 3564, 3591, 3592, 3593, 3648, 3650, 3736, 3914, 3917, 3930, 3997, 4214, 4274, 4275, 4276, 4559, 4560, 4646, 4647, 4649, 4650, 4651, 4652, 4653], [0.0595530456487, -0.145057212333, 0.00124758599452], this.colors.A))
            this.renderImage();
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.renderImage();' + time);

            // var start = new Date().getTime();
            // this.meshDataPreview();
            // var end = new Date().getTime();
            // var time = end - start;
            // console.log('Execution time: of this.meshDataPreview();' + time);
            
        },

        initLimits: function(){
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
        },

        getKey : function(x, y, z){
            N = 40;

            ix = parseInt( (  ( (x - this.minx)  * N ) / (this.maxx + 1e-5 - this.minx)  ) ) ;
            iy = parseInt( (  ( (y - this.miny)  * N ) / (this.maxy + 1e-5  - this.miny) ) ) ;
            iz = parseInt( (  ( (z - this.minz)  * N ) / (this.maxz + 1e-5 - this.minz)  ) );
            return new Array(ix, iy, iz);
        },

    
        makeGrid: function(){
          N = 40;
          console.log(" Constructing grid ");
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
                        var key = this.getKey(xcoord, ycoord, zcoord);

                        if(key[0] == 0 && key[1] == 0 && key[2] == 0)
                        {

                          console.log('hiasfdasdf');
                          1/0
                        }

                        this.grid.put( key , idx );           
                    } 
                  } 
              }
                          

          }

          console.log(" grid creation completed ");

        },

        makeInverseMap: function(){
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

        precalculateBaryCalc: function(){
          var xlimit = this.N;
          var ylimit = this.N;
          var zlimit = this.N;
          this.list = []
          this.baryMap = {}
          for (var x=0; x<xlimit; x++)
          {
            for(var y=0; y<ylimit; y++)
            {
              for(var z=0; z<zlimit; z++)
              {
                var a_x = ((x / (xlimit)) * (this.maxx - this.minx) + this.minx);
                var a_y = ((y / (ylimit)) * (this.maxy - this.miny) + this.miny);
                var a_z = ((z / (zlimit)) * (this.maxz - this.minz) + this.minz);
                var key  = this.getKey(a_x,a_y,a_z);
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

        renderImage: function(){
          var xlimit = this.N;
          var ylimit = this.N;
          var zlimit = this.N;
          
          var im = new Array(xlimit*ylimit*zlimit).fill(0);
          var data = this.colors["A"];
          for(var i = 0; i < this.list.length; i++)
          {
            var x = this.list[i].x;
            var y = this.list[i].y;
            var z = this.list[i].z;
            var result = this.list[i].result;
            var k = this.list[i].voxelKey;

            v1 =this.voxelTuples[k][0];
            v2 =this.voxelTuples[k][1];
            v3 =this.voxelTuples[k][2];
            v4 =this.voxelTuples[k][3];
              
            c1 = data[v1]
            c2 = data[v2]
            c3 = data[v3]
            c4 = data[v4]
              
            l1 =  result[0];
            l2 = result[1];
            l3 = result[2];
            l4 = Math.max(0.0, 1 - (l1 + l2 + l3))
              
            inval = l1 * c1 + l2 * c2 + l3 * c3 + l4 * c4

            im[(x*xlimit*ylimit)+(y*ylimit)+z] = inval;
            
          }
         this.meshDataPreview(im);//this.meshDataPreview(data);
        },

        meshDataPreview : function(imdata)
        {
            console.log("meshDataPreview : function(data)"); 
            var tgtCanvas = $( '.tgtCanvas' ).get(0);
            var width = 1024;
            var height =  1024;

            $( tgtCanvas ).prop('width', width).prop('height', height);

            var tgtCtx = tgtCanvas.getContext('2d');

            var min = _.min(imdata);
            var max = _.max(imdata);

            for(var i = 0; i < imdata.length; i++)
            {
              imdata[i] = (imdata[i] - min) / (max - min);
            }

            tgtData = tgtCtx.createImageData(width, height);
            for(var i = 0; i < width; i++)
            {
              for(var j = 0; j < height; j++)
              {
                tgtData.data[4 * (j * width + i)] = 0;
                tgtData.data[4 * (j * width + i) + 1] = 100;
                tgtData.data[4 * (j * width + i) + 2] = 255;
                tgtData.data[4 * (j * width + i) + 3] = 100;
              }
            }


            var idx = 0;
            var tiles = Math.floor(width / this.N);
            var range2 = Math.floor(height / this.N);
            var numslices = 10;
            var offset = 24;

            for(var z = 0; z < 100 ; z++)
            {

              for(var i = 0; i < this.N; i++)
              {
                for(var j = 0; j < this.N; j++)
                {
                      color1 = Math.floor(imdata[i*this.N*this.N+ j*this.N + z] * 255); 
                      color2 = Math.floor(imdata[i*this.N*this.N+ j*this.N + z] * 255);
                      color3 = 0;
                      var idx = (i + j * width+ (z % tiles)* this.N);
                      var rownum = Math.floor(z / tiles);
                      // if(z % 10 == 0 && z!=0)
                      //   {
                      //     idx += (this.N * rownum * width);
                      //   }
                      // else
                        idx += rownum* this.N * width ;
                      tgtData.data[ 4 * idx] = color1;
                      tgtData.data[ 4 * idx + 1] = color2;
                      tgtData.data[ 4 * idx + 2] = color3;
                      tgtData.data[ 4 * idx + 3] = 255;

      //                  idx+=4;
                    }
                }
                offset += this.N;
              
            }


            tgtCtx.putImageData(tgtData, 0, 0);
            //var threeJSTex = new THREE.DataTexture(texData, width, height);
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
