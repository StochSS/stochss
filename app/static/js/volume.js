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


            var start = new Date().getTime();
            //console.log(this.baryCalc([50, 250, 370, 473, 1058, 1297, 1337, 1359, 1572, 1591, 1768, 1847, 1877, 1965, 2029, 2065, 2189, 2201, 2210, 2246, 2495, 2518, 2535, 2548, 2583, 2600, 2629, 2728, 2798, 3037, 3054, 3100, 3238, 3256, 3258, 3261, 3262, 3389, 3564, 3591, 3592, 3593, 3648, 3650, 3736, 3914, 3917, 3930, 3997, 4214, 4274, 4275, 4276, 4559, 4560, 4646, 4647, 4649, 4650, 4651, 4652, 4653], [0.0595530456487, -0.145057212333, 0.00124758599452], this.colors.A))
            this.renderImage();
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: of this.renderImage();' + time);
            
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

        baryCalc: function(keys, r, data){
          //console.log("At baryCalc");
          //inverseMap, keys , (x, y, z), data

          var inval = 0;
          for(j in keys)
          {
              key = keys[j];
              inmatrix= this.inverseMap[key][0];
              r4 =  [this.inverseMap[key][1].x, this.inverseMap[key][1].y, this.inverseMap[key][1].z];
              var flag = true;

              var val = [r[0] - r4[0], r[1] - r4[1], r[2] - r4[2]];
              
              var result = [0.0, 0.0, 0.0];

              for(var i=0; i< 3; i++)
              {
                for(var j=0; j< 3; j++)
                {
                  result[i] += inmatrix[i][j] * val[j];
                }
              }

              
              for(i in result)
              {
                  if (result[i] < 0.0 || result[i] > 1)
                      flag = false;
              }        

              var inval = 0;
              if(flag && (result[0]+result[1]+result[2]) <= 1.0 + 1e-8)
              {
                  v1 =this.voxelTuples[key][0];
                  v2 =this.voxelTuples[key][1];
                  v3 =this.voxelTuples[key][2];
                  v4 =this.voxelTuples[key][3];
                  
                  c1 = data[v1]
                  c2 = data[v2]
                  c3 = data[v3]
                  c4 = data[v4]
                  
                  l1 =  result[0];
                  l2 = result[1];
                  l3 = result[2];
                  l4 = Math.max(0.0, 1 - (l1 + l2 + l3))
                  
                  inval = l1 * c1 + l2 * c2 + l3 * c3 + l4 * c4
                  return inval;
                }
          }
          return inval;
        },

        renderImage: function(){
          var xlimit = 10;
          var ylimit = 10;
          var zlimit = 10;
          
          for(var t=0;t<5; t++){ 
              var data = this.colors["A"];

              for(var l=0; l<zlimit; l++){
              
                  // Initializing image
                  var im = new Array(xlimit);
                  for (var i = 0; i < xlimit; i++) {
                    im[i] = new Array(ylimit);
                  }

                  for (var i=0; i<xlimit; i++ ){
                      for(var j=0; j<ylimit; j++){
                          
                          var x = ((i / (xlimit)) * (this.maxx - this.minx) + this.minx)
                          var y = ((j / (ylimit)) * (this.maxy - this.miny) + this.miny)
                          var z = ((l / (zlimit)) * (this.maxz - this.minz) + this.minz)
                          
                          var key  = this.getKey(x,y,z);
                          var keys = this.grid.get(key);

                          var keysList = [];

                          var inval = 0;
                          if(typeof(keys) != "undefined")
                          {
                            keys.forEach( function(a) { keysList.push(a); } )

                            if(keysList.length > 0)
                              inval = this.baryCalc(keysList, [x, y, z], data);
                          }

                          im[i][j] = inval;

                    }
                }
              }
          }
        },

        render : function(data)
        {
            if(typeof data != 'undefined')
            {
            }
        }
    }
);

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
