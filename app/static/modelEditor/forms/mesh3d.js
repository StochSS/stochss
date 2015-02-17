var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var SubdomainFormView = require('./subdomain');

module.exports = View.extend({
    template: $( ".mesh3dTemplate" ).text(),
    remove: function() {
        this.removing = true;

        delete this.camera;
        delete this.renderer;
        delete this.controls;
        
        View.prototype.remove.apply(this, arguments);
    },
    updateWorldCamera: function(){
        this.camera2.position.subVectors( this.camera.position, this.controls.target );
        this.camera2.position.setLength( 1.8 );
        this.camera2.lookAt( this.scene2.position );
    },
    renderFrame : function() {
        if(typeof(this.renderer) == "undefined")
            return
        this.renderer.render(this.scene, this.camera);
        this.updateWorldCamera();
        this.renderer2.render(this.scene2, this.camera2);
        requestAnimationFrame(_.bind(this.renderFrame, this));
        this.controls.update();
    },
    update : function(obj) {
        var subdomain = obj.value.model;
        var checked = obj.value.checked;
        // If we're already in the right state do nothing
        if(checked)
        {
            this.subdomains = _.union(this.subdomains, [subdomain.name]);
        }
        else
        {
            this.subdomains = _.difference(this.subdomains, [subdomain.name]);
        }

        this.highLightSubdomains(this.subdomains);
    },
    highLightSubdomains : function(subdomains)
    {
        var subdomainLabels = this.model.mesh.subdomains;

        var colors = new Array(subdomainLabels.length);
        
        for(var i = 0; i < subdomainLabels.length; i++)
        {
            if(_.contains(subdomains, subdomainLabels[i]))
            {
                colors[i] = new THREE.Color( 0x992200 );
            }
            else
            {
                colors[i] = new THREE.Color( 0x000066 );
            }
        }

        this.redrawColors(colors);
    },
    redrawColors : function(colors) {
        for(var i = 0; i < this.mesh.geometry.faces.length; i++)
        {
            var faceIndices = ['a', 'b', 'c'];         
            var face = this.mesh.geometry.faces[i];   
        
            // assign color to each vertex of current face
            for( var j = 0; j < 3; j++ )  
            {
                var vertexIndex = face[ faceIndices[ j ] ];
                face.vertexColors[ j ] = colors[vertexIndex];
            }
        }

        this.mesh.geometry.colorsNeedUpdate = true;
    },
    addGui : function() {
        $( this.queryByHook("container") ).show();
        $( this.queryByHook("zoomPlus_btn") ).click( _.bind(function() { this.controls.dollyOut();}, this) );
        $( this.queryByHook('zoomMinus_btn') ).click( _.bind(function() { this.controls.dollyIn();}, this) );
        $( this.queryByHook('panLeft_btn') ).click( _.bind(function() { this.controls.panLeft(-0.1);}, this) );
        $( this.queryByHook('panRight_btn') ).click( _.bind(function() { this.controls.panLeft(0.1);}, this) );
        $( this.queryByHook('panUp_btn') ).click( _.bind(function() { this.controls.panUp(-0.1);}, this) );
        $( this.queryByHook('panDown_btn') ).click( _.bind(function() { this.controls.panUp(0.1);}, this) );
        
        $( this.queryByHook('rotateUp_btn') ).click( _.bind(function() { this.controls.rotateUp(0.5);}, this) );
        $( this.queryByHook('rotateDown_btn') ).click( _.bind(function() { this.controls.rotateUp(-0.5);}, this) );
        $( this.queryByHook('rotateRight_btn') ).click( _.bind(function() { this.controls.rotateLeft(0.5);}, this) );
        $( this.queryByHook('rotateLeft_btn') ).click( _.bind(function() { this.controls.rotateLeft(-0.5);}, this) );
        $( this.queryByHook('reset_btn') ).click( _.bind(function() { this.controls.reset();this.camera.position.z = 1.5; }, this) ); 
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
        var dom2 = $( this.queryByHook('inset') ).empty();
        var camera2 = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000);
        this.camera2 = camera2; 
        
        // renderer
        var renderer2 = new THREE.WebGLRenderer({ alpha: true });
        renderer2.setClearColor( 0x000000, 0 ); 
        console.log("Width: ",this.d_width);
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

    meshDataPreview : function()
    {
        var data = this.model.mesh.threeJsMesh;

        if (!window.WebGLRenderingContext) {
            // Browser has no idea what WebGL is. Suggest they
            // get a new browser by presenting the user with link to
            // http://get.webgl.org
            $(this.queryByHook("mesh")).html('<center><h2 style="color: red;">WebGL Not Supported</h2><br /> \
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
            $(this.queryByHook("mesh")).html('<center><h2 style="color: red;">WebGL Disabled</h2><br /> \
<ul><li>In Safari and certain older browsers, this must be enabled manually</li> \
<li>Browsers can also throw this error when they detect old or incompatible video drivers</li> \
<li>Enable WebGL, or try using StochSS in an up to date Chrome or Firefox browser</li> \
</ul></center>');
            return;  
        }
        
        if(!this.renderer)
        {
            var scene = new THREE.Scene();
            var width = $( this.el ).width();
            this.d_width = width;
            var height = 0.75 * width;
            this.d_height = height;
            var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            renderer.setClearColor( 0xffffff, 1);
                
            this.rendererDom = $( renderer.domElement ).appendTo( this.queryByHook( "mesh" ) );
            
            var controls = new OrbitControls( camera, renderer.domElement );
            // var controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );
            
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
        
        var model = loader.parse(data);
        
        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe: true } );
	
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(model.geometry, material);
        scene.add(mesh);

        this.mesh = mesh;
        
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

        this.highLightSubdomains([])
        
        if(!this.rendererInitialized)
        {
            this.rendererInitialized = true;
            this.renderFrame();
        }
    },
    downloadNewMesh: function()
    {
        if(this.subdomainsView)
        {
            this.subdomainsView.remove();
        }

        this.subdomainsView = this.renderCollection(this.model.mesh.uniqueSubdomains, SubdomainFormView, this.queryByHook('subdomains'));

        this.subdomains = [];

        this.model.mesh.downloadMesh(_.bind(this.meshDataPreview, this));
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.listenToAndRun(this.model, 'change:mesh', _.bind(this.downloadNewMesh, this));

        return this;
    }
});
