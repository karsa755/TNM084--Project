
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls = new THREE.OrbitControls( camera );
controls.maxDistance = 2.5;
var radius = 1.0;
var time = 0.0;
var renderer = new THREE.WebGLRenderer({antialias: true}); //have display aliasing issues, probably
renderer.setSize( window.innerWidth, window.innerHeight );
var geometry = new THREE.SphereGeometry( radius, 32, 32 );
var geometryClouds = new THREE.SphereGeometry(radius*1.01, 32, 32);
var geoSun = new THREE.SphereGeometry(radius*2.0, 32, 32);
var material, mainText, materialCloud;
var clock;
var lightPos = new THREE.Vector3(-5.0, -5.0, 0.0);
var sun, clouds, worldSphere;
SHADER_LOADER.load(
    function (data)
    {  
        clock = new THREE.Clock();
        var worldVertexhader = data.world.vertex;
        var worldFragmentShader = data.world.fragment;
        var cloudVertexShader = data.cloud.vertex;
        var cloudFragmentShader = data.cloud.fragment;

        var worley3D = data.worley3D.vertex;
        var simplex3D = data.simplex3D.vertex;
        
        mainText = new FizzyText();
        var gui = new dat.GUI({ autoPlace: false, width:350 });
        gui.add(mainText, 'message');
        gui.addColor(mainText,'heightColor');
        gui.addColor(mainText,'groundColor');
        gui.addColor(mainText,'coastColor');
        gui.addColor(mainText,'cloudColor');
        gui.add(mainText,'heightColorVariation', 0.01, 1.0);
        gui.add(mainText, 'displacementHeight', 0.0, 1.0);
        gui.add(mainText, 'landClumping', 0.01, 10.0);
        gui.add(mainText, 'cloudClumping', 0.01, 0.5);
        gui.add(mainText, 'cloudSpeed', 0.0, 0.1);
        gui.add(mainText,'HeightGroundRatio', -0.21, 1.21);
        gui.add(mainText, 'wireframe');
        gui.add(mainText, 'clouds');
        var customContainer = $('.moveGUI').append($(gui.domElement));


        material = new THREE.ShaderMaterial( {

            uniforms: {
        
                heightColor: { type: 'v3', value: new THREE.Color(mainText.heightColor) },
                groundColor: { type: 'v3', value: new THREE.Color(mainText.groundColor) },
                coastColor: { type: 'v3', value: new THREE.Color(mainText.coastColor) },
                cameraPos: {type:'v3', value: camera.position},
                lightPos: {type:'v3', value: lightPos},
                time: {type:'float', value: time},
                displaceObj: {type:'float', value: mainText.displacementHeight},
                noiseSize: {type:'float', value: mainText.landSpread},
                HGratio: {type:'float', value: mainText.HeightGroundRatio},
                colorNoiseSize: {type:'float', value: mainText.heightColorVariation},
            },
        
            vertexShader:   simplex3D + worldVertexhader,
            fragmentShader: simplex3D + worldFragmentShader,
        } );

        materialCloud = new THREE.ShaderMaterial( {

            uniforms: {
        
                cloudColor: { type: 'v3', value: new THREE.Color(mainText.cloudColor) },
                noiseSize: {type:'float', value: mainText.cloudClumping},
                timeSpeed: {type:'float', value: mainText.cloudSpeed},
                displaceObj: {type:'float', value: mainText.displacementHeight},
                time: {type:'float', value: time},
                isClouds: {type:'float', value: 1.0},
            },

            vertexShader:   simplex3D + cloudVertexShader,
            fragmentShader: simplex3D + cloudFragmentShader,
        } );
        materialCloud.transparent = true;
        var materialSun = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        worldSphere = new THREE.Mesh( geometry, material );
        clouds = new THREE.Mesh(geometryClouds, materialCloud);
        sun = new THREE.Mesh(geoSun, materialSun);
        
        scene.add(clouds);
        scene.add(worldSphere);
        scene.add(sun);
        sun.position.set(lightPos.x, lightPos.y, lightPos.z);
        camera.position.z = 2.5; 
       
        var animate = function () {
            requestAnimationFrame( animate );
            controls.update();
            material.uniforms.heightColor.value = new THREE.Color(mainText.heightColor);
            material.uniforms.groundColor.value = new THREE.Color(mainText.groundColor);
            material.uniforms.coastColor.value = new THREE.Color(mainText.coastColor);
            materialCloud.uniforms.cloudColor.value = new THREE.Color(mainText.cloudColor);
            material.uniforms.time.value = clock.getElapsedTime();
            materialCloud.uniforms.time.value = clock.getElapsedTime();
            material.uniforms.displaceObj.value = mainText.displacementHeight;
            materialCloud.uniforms.displaceObj.value = mainText.displacementHeight;
            material.uniforms.noiseSize.value = mainText.landClumping;
            materialCloud.uniforms.noiseSize.value = mainText.cloudClumping;
            materialCloud.uniforms.timeSpeed.value = mainText.cloudSpeed;
            material.uniforms.HGratio.value = mainText.HeightGroundRatio;
            //material.uniforms.cameraPos.value = camera.position;
            material.uniforms.colorNoiseSize.value = mainText.heightColorVariation;
            material.wireframe = mainText.wireframe;
            let checkClouds = mainText.clouds ? 1.0 : 0.0;
            materialCloud.uniforms.isClouds.value = checkClouds;
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
    this.cloudClumping = 0.25;
    this.wireframe = false;
    this.clouds = true;
    this.heightColor ="rgb(96,128,56)";
    this.heightColorVariation = 0.5;
    this.cloudSpeed = 0.02;
    this.groundColor ="rgb(0,119,190)"; 
    this.cloudColor ="rgb(221,231,238)";
    this.coastColor ="rgb(194,178,128)";  
};


