
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var time = 0.0;
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff, 1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material;
var clock, light;
var lightPos = new THREE.Vector3(0.0, 0.0 ,5.0);
SHADER_LOADER.load(
    function (data)
    {
        clock = new THREE.Clock();

        var worldVertexhader = data.world.vertex;
        var worldFragmentShader = data.world.fragment;
        

        var worley3D = data.worley3D.vertex;
        var simplex3D = data.simplex3D.vertex;
    
        material = new THREE.ShaderMaterial( {

            uniforms: {
        
                color: { type: 'v3', value: new THREE.Color(0xcccccc) },
                time: {type:'float', value: time},
                lightPos: {type: 'v3', value: lightPos},
                cameraPos: {type: 'v3', value:camera.position},
            },
        
            vertexShader:   simplex3D + worldVertexhader,
            fragmentShader: simplex3D + worldFragmentShader,
        } );
        
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame( animate );
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            material.uniforms.time.value = clock.getElapsedTime();
            renderer.render( scene, camera );
        };

        animate();
        
    }
);


