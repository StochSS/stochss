var MeshToTexture = MeshToTexture || {};

MeshToTexture.Converter = function(mesh,
                                   voxels,
                                   minv,
                                   maxv,
                                   requestedTexWidth,
                                   requestedTexHeight)
{
    this.mesh = mesh;
    this.minv = (typeof(minv) != 'undefined') ? minv : 0.0;
    this.maxv = (typeof(maxv) != 'undefined') ? maxv : minv + 1.0;

    this.voxels = voxels;

    // Requested size of texture for volume renderer.
    // The actual texture dimensions will be the largest texture that can be used that fits inside this
    this.rTexWidth = (typeof(requestedTexWidth) != 'undefined') ? requestedTexWidth : 256;
    this.rTexHeight = (typeof(requestedTexHeight) != 'undefined') ? requestedTexHeight : 256;

    // These are the actual texture dimensions
    // this.texWidth
    // this.texHeight

    // Dimensions of structured mesh
    // this.Nx
    // this.Ny
    // this.Nz

    // Binsize for hashmap mapping coordinates -> potential tetrahedral voxels with might contain those coordinates
    this.vbN = 20;

    // These store the min and maxes of all the vertex positions in the mesh
    // this.minx
    // this.maxx
    // this.miny
    // this.maxy
    // this.minz
    // this.maxz

    // Coordinates to tetrahedral voxels hashmap (mentioned above)
    // this.c2v
    
    // Voxel ID -> inverse matrix map (the matrix for Barycentric coordinate transformation)
    // this.inverseMap

    this.computeMeshLimits();
    this.constructCoodinatesToVoxelBinHashmap();
    this.constructInverseMap();
    this.constructBaryMap();
};

MeshToTexture.Converter.prototype.getVoxelBinFromCoordinates = function(x, y, z)
{
    ix = parseInt((((x - this.minx) * this.vbN) / (this.maxx - this.minx)));
    iy = parseInt((((y - this.miny) * this.vbN) / (this.maxy - this.miny)));
    iz = parseInt((((z - this.minz) * this.vbN) / (this.maxz - this.minz)));

    // The endpoint doesn't get its own bin
    if(ix == this.vbN)
        ix -= 1;

    if(iy == this.vbN)
        iy -= 1;

    if(iz == this.vbN)
        iz -= 1;

    return [ix, iy, iz];
};

MeshToTexture.Converter.prototype.computeMeshLimits = function()
{
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

    var xrange = (this.maxx - this.minx);
    var yrange = (this.maxy - this.miny);
    var zrange = (this.maxz - this.minz);
    
    var i = 1;
    for(i = this.rTexWidth; i > 0; i--)
    {
        var Nx = i;
        var Ny = Math.floor(Nx * yrange / xrange);
        var Nz = Math.floor(Nx * zrange / xrange);
        var horizontal = Math.floor(this.rTexWidth / Nx);
        var vertical = Math.floor(this.rTexHeight / Ny);
        if((horizontal * vertical) > Nz) break;
    }

    this.Nx = Math.floor(i+1);
    this.Ny = Math.floor(this.Nx * yrange / xrange);
    this.Nz = Math.floor(this.Nx * zrange / xrange);

    var horizontal = Math.floor(this.rTexWidth / this.Nx);
    var vertical = Math.floor(this.rTexHeight / this.Ny);

    this.texWidth = horizontal * this.Nx;
    this.texHeight = this.Ny * Math.ceil(this.Nz / horizontal);
};

MeshToTexture.Converter.prototype.constructCoodinatesToVoxelBinHashmap = function() {
    this.c2v = new TupleDictionary();

    for(var idx=0; idx < this.voxels.length; idx++) {
        var tuples = this.voxels[idx];
        
        var voxelCoords = [];
        var xs = []; var ys =[]; var zs = [];
        for(var i=0; i<4; i++) {
            vertices = this.mesh.geometry.vertices[tuples[i]];
            voxelCoords[i] = vertices;
            xs[i] = vertices['x'];
            ys[i] = vertices['y'];
            zs[i] = vertices['z'];
            
        }

        var vminx = _.min(xs);
        var vmaxx = _.max(xs);
        var vminy = _.min(ys);
        var vmaxy = _.max(ys);
        var vminz = _.min(zs);
        var vmaxz = _.max(zs);
        
        var dx = (this.maxx - this.minx) / this.vbN;
        var dy = (this.maxy - this.miny) / this.vbN;
        var dz = (this.maxz - this.minz) / this.vbN;
        
        var ixlimit = Math.ceil((vmaxx - vminx) / dx) + 1;
        var iylimit = Math.ceil((vmaxy - vminy) / dy) + 1;
        var izlimit = Math.ceil((vmaxz - vminz) / dz) + 1;
        
        for(var ix=0; ix<ixlimit; ix++) {
            for(var iy=0; iy<iylimit; iy++) {
                for(var iz=0; iz<izlimit; iz++) {
                    var xcoord = Math.min(vminx + dx * ix, vmaxx);
                    var ycoord = Math.min(vminy + dy * iy, vmaxy);
                    var zcoord = Math.min(vminz + dz * iz, vmaxz);

                    var key = this.getVoxelBinFromCoordinates(xcoord, ycoord, zcoord);

                    this.c2v.put( key , idx );           
                }
            }
        }
    }
};

MeshToTexture.Converter.prototype.constructInverseMap = function()
{
    this.inverseMap = {};

    for(var idx=0; idx < this.voxels.length; idx++){
        var tuples = this.voxels[idx];
        
        var voxelCoords = [];
        var xs = []; var ys =[]; var zs = [];
        for(var i=0; i<4; i++)
        {
            voxelCoords[i] = this.mesh.geometry.vertices[tuples[i]];
        }

        v1 = voxelCoords[0]
        v2 = voxelCoords[1]
        v3 = voxelCoords[2]
        v4 = voxelCoords[3]
    
        var matrix = [[v1['x'] - v4['x'], v2['x'] - v4['x'],  v3['x'] - v4['x']],
                     [v1['y'] - v4['y'], v2['y'] - v4['y'],  v3['y'] - v4['y']],
                     [v1['z'] - v4['z'], v2['z'] - v4['z'],  v3['z'] - v4['z']]];

        this.inverseMap[idx] = new Array();
        this.inverseMap[idx].push(this.getInverse(matrix));
        this.inverseMap[idx].push(voxelCoords[3]);
    }
};

MeshToTexture.Converter.prototype.getInverse = function(A) {
    var d1 = A[0][0] * (A[1][1] * A[2][2] - A[2][1] * A[1][2])
    var d2 = A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
    var d3 = A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])

    var determinant = d1 - d2 + d3
    
    if(determinant == 0)
    {
        console.log("Error in determinant");
        determinant = 1
    }
    
    var invdet = 1/determinant;
    
    var inverse = []

    var e1 =  (A[1][1] * A[2][2] - A[2][1] * A[1][2]) * invdet;
    var e2 = -(A[0][1] * A[2][2] - A[0][2] * A[2][1]) * invdet;
    var e3 =  (A[0][1] * A[1][2] - A[0][2] * A[1][1]) * invdet;
    inverse.push([e1, e2, e3]);
    
    e1 = -(A[1][0] * A[2][2] - A[1][2] * A[2][0]) * invdet;
    e2 =  (A[0][0] * A[2][2] - A[0][2] * A[2][0]) * invdet;
    e3 = -(A[0][0] * A[1][2] - A[1][0] * A[0][2]) * invdet;
    inverse.push([e1, e2, e3])
    
    e1 =  (A[1][0] * A[2][1] - A[2][0] * A[1][1]) * invdet;
    e2 = -(A[0][0] * A[2][1] - A[2][0] * A[0][1]) * invdet;
    e3 =  (A[0][0] * A[1][1] - A[1][0] * A[0][1]) * invdet;
    inverse.push([e1, e2, e3])

    return inverse
};

MeshToTexture.Converter.prototype.constructBaryMap = function()
{
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
                var a_x = ((x / (xlimit-1)) * (this.maxx - this.minx) + this.minx) * 1.1;
                var a_y = ((y / (ylimit-1)) * (this.maxy - this.miny) + this.miny) * 1.1;
                var a_z = ((z / (zlimit-1)) * (this.maxz - this.minz) + this.minz) * 1.1;
                var key  = this.getVoxelBinFromCoordinates(a_x,a_y,a_z);
                var keys = this.c2v.get(key);
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
};

MeshToTexture.Converter.prototype.baryCalc = function(key, r)
{
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
};

MeshToTexture.Converter.prototype.generateTexture = function(data)
{
    //There are two conversions that happen here
    // One goes from unstructured tetrahedral mesh to
    //   structured Nx * Ny * Nz mesh
    // The next goes from the structed mesh, which we think of as a stack of images
    //   to that stack of images tiled in one large 2D texture (so WebGL can read it)
    // This returns a flat array that can be constructed into a this.texHeight * this.texWidth
    //   RGBA texture with THREE.DataTexture

    var xlimit = this.Nx;
    var ylimit = this.Ny;
    var zlimit = this.Nz;
    
    var im = new Array(xlimit*ylimit*zlimit).fill(0);

    var min = _.min(data);
    var max = _.max(data);

    for(var i = 0; i < this.list.length; i++)
    {
        var x = this.list[i].x;
        var y = this.list[i].y;
        var z = this.list[i].z;
        var result = this.list[i].result;
        var k = this.list[i].voxelKey;

        var v1 = this.voxels[k][0];
        var v2 = this.voxels[k][1];
        var v3 = this.voxels[k][2];
        var v4 = this.voxels[k][3];
        
        var c1 = data[v1]
        var c2 = data[v2]
        var c3 = data[v3]
        var c4 = data[v4]
        
        var l1 =  result[0];
        var l2 = result[1];
        var l3 = result[2];
        var l4 = Math.max(0.0, 1 - (l1 + l2 + l3))
        
        var inval = l1 * c1 + l2 * c2 + l3 * c3 + l4 * c4

        im[(x*ylimit*zlimit)+(y*zlimit)+z] = (inval - min) / (max - min);
    }

    // We've converted to the structured mesh, now to convert to 2D texture

    var width = this.texWidth;
    var height = this.texHeight;

    var tgtData = new Uint8Array(4 * width * height).fill(0);

    var tiles = Math.floor(width / this.Nx);

    for(var z = 0; z < this.Nz ; z++)
    {
        for(var i = 0; i < this.Nx; i++)
        {
            for(var j = 0; j < this.Ny; j++)
            {
                color1 = Math.floor(im[i*this.Ny * this.Nz+ j*this.Nz +z] * 255); 
                color2 = Math.floor(im[i*this.Ny * this.Nz+ j*this.Nz +z] * 255);
                color3 = 0;
                var idx = (i + j * width+ (z % tiles)* this.Nx);
                var rownum = Math.floor(z / tiles);
                idx += rownum* this.Ny* width ;
                tgtData[4 * idx] = color1;
                tgtData[4 * idx + 1] = color2;
                tgtData[4 * idx + 2] = color3;
                tgtData[4 * idx + 3] = 255;
            }
        }
    }

    return tgtData;
    // Write assign new texture to shader and write it to GPU
    //this.g.voltex.value = texture;
    //this.g.voltex.needsUpdate = true;
};

//Taken from http://stackoverflow.com/a/1426016/3769360
function TupleDictionary() {
    this.dict = {};
};

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
