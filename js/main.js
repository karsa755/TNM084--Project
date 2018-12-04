var material;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

loadAllShaders();

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();


function loadAllShaders()
{
    SHADER_LOADER.load(
        function (data)
        {
            
            let worldVertexhader = data.world.vertex;
            let worldFragmentShader = data.world.fragment;
            console.log(worldVertexhader);
            console.log(worldFragmentShader);
            material = new THREE.ShaderMaterial( {
    
                uniforms: {
            
                    time: { value: 1.0 },
                    resolution: { value: new THREE.Vector2() }
            
                },
            
                vertexShader: worldVertexhader,
                fragmentShader: worldFragmentShader,
            
            } );
        }
    );
}