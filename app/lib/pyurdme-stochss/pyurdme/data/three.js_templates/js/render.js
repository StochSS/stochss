var renderPyURDMEMesh= function(pyurdme_mesh_json, tmp, solution)
{
    var dom = document.getElementById(tmp);
    var scene = new THREE.Scene();
    var width = 500;//$("#"+tmp).width();
    var height = width;
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height);
    
    dom.appendChild( renderer.domElement );
    
    var loader = new THREE.JSONLoader();
    function load_geometry(model){
	if(solution)
	{
            var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe:false});
	} else {
            var material = new THREE.MeshLambertMaterial({color: "blue", wireframe:true});
	}
	
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(model.geometry,material);
        scene.add(mesh);
    }


    var model = loader.parse(pyurdme_mesh_json);
    load_geometry(model);

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
   // var controls = new THREE.OrbitControls( camera );
    //controls.addEventListener( 'change', render );

    camera.position.z = 1;
                    
    
    // add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x000044);
    scene.add(ambientLight);
    hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
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
}