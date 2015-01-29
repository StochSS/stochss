var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var SubdomainFormView = require('./subdomain');

module.exports = View.extend({
    template: '<div>\
  <h3>Mesh Preview</h3>\
  <div data-hook="mesh">\
  </div>\
  <h3>Display Subdomains</h3>\
  <div data-hook="subdomains">\
  </div>\
</div>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    renderFrame : function() {
        this.renderer.render(this.scene, this.camera);
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
                colors[i] = new THREE.Color( 0xFF0000 );
            }
            else
            {
                colors[i] = new THREE.Color( 0x000000 );
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
    // This event gets fired when the user selects a csv data file
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
            var width = 800;
            var height = 0.75 * width;
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
