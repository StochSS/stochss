var renderPyURDMEMesh= function(pyurdme_mesh_json, div_id, solution, alpha, iswireframe, width, camera_x, camera_y, camera_z)
{
    var dom = document.getElementById(div_id);
    var scene = new THREE.Scene();
    var height = 0.75 * width;
    var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(width, height);
    
    dom.appendChild(renderer.domElement);
    
    var loader = new THREE.JSONLoader();
    function load_geometry(model){
	if(solution)
	{
        if (iswireframe) {
            var material_mesh = new THREE.MeshLambertMaterial({color: "grey", wireframe:true, transparent:true,opacity:alpha});
            mesh = new THREE.Mesh(model.geometry,material_mesh);
            material_mesh.side = THREE.DoubleSide;
            scene.add(mesh);

        }
        
        var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe:false,transparent:true, opacity:alpha});
        sol =  new THREE.Mesh(model.geometry.clone(),material);
        material.side = THREE.DoubleSide;
        scene.add(sol);


	} else {
        var material_mesh = new THREE.MeshLambertMaterial({color: "blue", wireframe:true});
        material_mesh.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(model.geometry,material_mesh);
        scene.add(mesh);
        
	}
	
        
    }


    var model = loader.parse(pyurdme_mesh_json);
    load_geometry(model);

    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    camera.position.x = camera_x;
    camera.position.y = camera_y;
    camera.position.z = camera_z;
    
    var spotLight = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
    spotLight.position.set( 0, 150, 0 );
    
    var spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 0);
    spotLight.target = spotTarget;
    
    scene.add(spotLight);
    scene.add(new THREE.PointLightHelper(spotLight, 1));
                    
    
    // add subtle blue ambient lighting
    // var ambientLight = new THREE.AmbientLight(0x404040);
    //scene.add(ambientLight);
    hemiLight = new THREE.HemisphereLight(0x404040, 0x404040, 0.6 );
    scene.add(hemiLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0x404040);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);


    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
    }
    render();
}


var renderParticles = function(tmp, x, y, z, c, radius, width)
{
    var dom = document.getElementById(tmp);
    var scene = new THREE.Scene();
    var height = 0.75 * width;
    var camera = new THREE.PerspectiveCamera( 75, 4.0 / 3.0, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize( width, height);
    
    dom.appendChild( renderer.domElement );

var moleculegeom   = new THREE.SphereGeometry(1.0);

for (var i=0; i<x.length;i++)
{
    var material    = new THREE.MeshLambertMaterial( { color: c[i] } );
    var molecule  = new THREE.Mesh(moleculegeom, material );
    molecule.position = new THREE.Vector3(x[i],y[i],z[i]);
    molecule.scale.x = molecule.scale.y = molecule.scale.z = radius[i];
    scene.add( molecule );
}

var controls = new THREE.OrbitControls( camera, renderer.domElement );
camera.position.z = 1;


hemiLight = new THREE.HemisphereLight(0x404040, 0x404040, 0.8 );
scene.add(hemiLight);

var spotLight = new THREE.SpotLight(0xffffff, 1, 100, 45, 1);
spotLight.position.set( 0, 150, 0 );
    
var spotTarget = new THREE.Object3D();
spotTarget.position.set(0, 0, 0);
spotLight.target = spotTarget;
    
scene.add(spotLight);
scene.add(new THREE.PointLightHelper(spotLight, 1));
    
    
    
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
