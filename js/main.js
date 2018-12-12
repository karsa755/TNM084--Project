
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls = new THREE.OrbitControls( camera );

var time = 0.0;
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material, mainText;
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
        
        mainText = new FizzyText();
        var gui = new dat.GUI({ autoPlace: false, width:350 });
        gui.add(mainText, 'message');
        gui.addColor(mainText,'heightColor');
        gui.addColor(mainText,'groundColor');
        gui.add(mainText,'heightColorVariation', 0.01, 1.0);
        gui.add(mainText, 'displacementHeight', 0.0, 1.0);
        gui.add(mainText, 'landClumping', 0.01, 10.0);
        gui.add(mainText,'HeightGroundRatio', -0.01, 1.01);
        gui.add(mainText, 'wireframe');
        var customContainer = $('.moveGUI').append($(gui.domElement));

        material = new THREE.ShaderMaterial( {

            uniforms: {
        
                heightColor: { type: 'v3', value: new THREE.Color(mainText.heightColor) },
                groundColor: { type: 'v3', value: new THREE.Color(mainText.groundColor) },
                time: {type:'float', value: time},
                displaceObj: {type:'float', value: mainText.displacementHeight},
                noiseSize: {type:'float', value: mainText.landSpread},
                HGratio: {type:'float', value: mainText.HeightGroundRatio},
                colorNoiseSize: {type:'float', value: mainText.heightColorVariation},
            },
        
            vertexShader:   simplex3D + worldVertexhader,
            fragmentShader: simplex3D + worldFragmentShader,
        } );
        
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;    
       
        var animate = function () {
            requestAnimationFrame( animate );
            controls.update();
            material.uniforms.heightColor.value = new THREE.Color(mainText.heightColor);
            material.uniforms.groundColor.value = new THREE.Color(mainText.groundColor);
            material.uniforms.time.value = clock.getElapsedTime();
            material.uniforms.displaceObj.value = mainText.displacementHeight;
            material.uniforms.noiseSize.value = mainText.landClumping;
            material.uniforms.HGratio.value = mainText.HeightGroundRatio;
            material.uniforms.colorNoiseSize.value = mainText.heightColorVariation;
            material.wireframe = mainText.wireframe;
            renderer.render( scene, camera );
        };

        animate();
        document.body.appendChild( renderer.domElement );
        
    }
);

var FizzyText = function() {
    this.message = 'Planet editor';
    this.displacementHeight = 0.1;
    this.landClumping = 1.0;
    this.HeightGroundRatio = 0.5;
    this.wireframe = false;
    this.heightColor ="rgb(96,128,56)";
    this.heightColorVariation = 0.5;
    this.groundColor ="rgb(0,47,75)";  
};


