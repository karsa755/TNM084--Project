
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var controls = new THREE.OrbitControls( camera );
controls.maxDistance = 4.0;
controls.minDistance = 1.5;
var radius = 1.0;
var outerRad = radius * 1.15;
var time = 0.0;
var renderer = new THREE.WebGLRenderer({antialias: true}); //might need to look at supersampling
var segmentSize = 128;
renderer.setSize( window.innerWidth, window.innerHeight );
var geometry = new THREE.SphereGeometry( radius, segmentSize,segmentSize );
var geometryClouds = new THREE.SphereGeometry(radius*1.001, segmentSize, segmentSize);
var geometryAtmosphereGround = new THREE.SphereGeometry(radius * 1.053, segmentSize, segmentSize);
var geoSun = new THREE.SphereGeometry(radius*0.075, 16, 16);
var material, mainText, materialCloud, materialAtmosphereSky, materialAtmosphereGround;
var clock;
var lightPos = new THREE.Vector3(-5.0, -5.0, 0.0);
var sun, clouds, worldSphere, atmoSphereGround;
var dTime = 0.0;
var prevTime = 0.0;

//these parameters were also found at http://jsfiddle.net/VsWb9/770/
var atmosphereVariables = {
    Kr: 0.0025,
    Km: 0.0010,
    ESun: 20.0,
    g: -0.950,
    innerRadius: radius * 1.053,
    outerRadius: outerRad,
    wavelength: new THREE.Vector3(0.650, 0.570, 0.475),
    scale: radius / (outerRad - radius * 1.053),
    scaleDepth: 0.25,
    mieScaleDepth: 0.1,
    g: -0.950,
  };

SHADER_LOADER.load(
    function (data)
    {  
        clock = new THREE.Clock();
        var worldVertexhader = data.world.vertex;
        var worldFragmentShader = data.world.fragment;
        var cloudVertexShader = data.cloud.vertex;
        var cloudFragmentShader = data.cloud.fragment;
        var atmosphereGroundVertexShader = data.atmosphereGround.vertex;
        var atmosphereGroundFragmentShader = data.atmosphereGround.fragment;

        var worley3D = data.worley3D.vertex;
        var simplex3D = data.simplex3D.vertex;
        var phongShader = data.phong.fragment;
        
        mainText = new FizzyText();
        var gui = new dat.GUI({ autoPlace: false, width:350 });
        gui.add(mainText, 'message');
        gui.addColor(mainText,'heightColor');
        gui.addColor(mainText,'groundColor');
        gui.addColor(mainText,'coastColor');
        gui.addColor(mainText,'cloudColor');
        gui.addColor(mainText,'atmosphereColor');
        gui.add(mainText,'heightColorVariation', 0.01, 1.0);
        gui.add(mainText, 'displacementHeight', 0.0, 1.0);
        gui.add(mainText, 'landClumping', 0.01, 10.0);
        gui.add(mainText, 'cloudClumping', 0.01, 0.5);
        gui.add(mainText, 'cloudSpeed', 0.0, 0.1);
        gui.add(mainText,'HeightGroundRatio', -0.21, 1.21);
        gui.add(mainText, 'wireframe');
        gui.add(mainText, 'clouds');
        gui.add(mainText, 'atmosphere');
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
            fragmentShader: phongShader + simplex3D + worldFragmentShader,
        } );

        materialCloud = new THREE.ShaderMaterial( {

            uniforms: {
        
                cloudColor: { type: 'v3', value: new THREE.Color(mainText.cloudColor) },
                noiseSize: {type:'float', value: mainText.cloudClumping},
                timeSpeed: {type:'float', value: mainText.cloudSpeed},
                displaceObj: {type:'float', value: mainText.displacementHeight},
                time: {type:'float', value: time},
                isClouds: {type:'float', value: 1.0},
                cameraPos: {type:'v3', value: camera.position},
                lightPos: {type:'v3', value: lightPos},
            },

            vertexShader:   simplex3D + cloudVertexShader,
            fragmentShader: phongShader + simplex3D + cloudFragmentShader,
        } );
        var atmoUni = {
            time: {type:'float', value: time},
            cameraPos: {type:'v3', value: camera.position},
            lightPos: {type:'v3', value: lightPos},
            inWaveLength: {type:'v3', value: new THREE.Vector3(1 / Math.pow(atmosphereVariables.wavelength.x, 4), 1 / Math.pow(atmosphereVariables.wavelength.y, 4), 1 / Math.pow(atmosphereVariables.wavelength.z, 4))},
            atmoColor: { type: 'v3', value: new THREE.Color(mainText.atmosphereColor) },
            cameraHeight: {type:'float', value: camera.position.y},
            cameraHeight2: {type:'float', value: camera.position.y * camera.position.y},
            outerRadius: {type:'float', value: atmosphereVariables.outerRadius},
            outerRadius2: {type:'float', value: atmosphereVariables.innerRadius * atmosphereVariables.innerRadius},
            innerRadius: {type:'float', value: atmosphereVariables.innerRadius},
            innerRadius2: {type:'float', value: atmosphereVariables.innerRadius * atmosphereVariables.innerRadius},
            krESun: {type:'float', value: atmosphereVariables.ESun * atmosphereVariables.Kr},
            kmESun: {type:'float', value: atmosphereVariables.ESun * atmosphereVariables.Km},
            kr4PI: {type:'float', value: atmosphereVariables.Kr * 4.0 * Math.PI},
            km4PI: {type:'float', value: atmosphereVariables.Km * 4.0 * Math.PI},
            scale: {type:'float', value: atmosphereVariables.scale},
            scaleDepth: {type:'float', value: atmosphereVariables.scaleDepth},
            scaleOverScaleDepth: {type:'float', value: atmosphereVariables.scale / atmosphereVariables.scaleDepth},
            g: {type:'float', value: atmosphereVariables.g},
            g2: {type:'float', value: atmosphereVariables.g*atmosphereVariables.g},
            displaceObj: {type:'float', value: mainText.displacementHeight},  
            atmosBool: {type:'float', value: mainText.atmosphere},           
        };

        materialAtmosphereGround = new THREE.ShaderMaterial( {

            uniforms: atmoUni,
            vertexShader:   atmosphereGroundVertexShader,
            fragmentShader: phongShader + atmosphereGroundFragmentShader,
        } );
        materialCloud.transparent = true;
        materialAtmosphereGround.transparent = true;
        var materialSun = new THREE.MeshBasicMaterial( {color: 0xfcd440 } );
        worldSphere = new THREE.Mesh( geometry, material );
        clouds = new THREE.Mesh(geometryClouds, materialCloud);
        atmoSphereGround = new THREE.Mesh(geometryAtmosphereGround, materialAtmosphereGround);
        sun = new THREE.Mesh(geoSun, materialSun);
        
        scene.add(clouds);
        scene.add(worldSphere);
        scene.add(sun);
        scene.add(atmoSphereGround);
        sun.position.set(lightPos.x, lightPos.y, lightPos.z);
        camera.position.z = 4.0; 
        prevTime = clock.getElapsedTime();
        var animate = function () {
            dTime += clock.getElapsedTime() - prevTime;
            
            requestAnimationFrame( animate );
            controls.update();
            //variables that needs to be updated for the GUI and in the shader.
            material.uniforms.heightColor.value = new THREE.Color(mainText.heightColor);
            material.uniforms.groundColor.value = new THREE.Color(mainText.groundColor);
            material.uniforms.coastColor.value = new THREE.Color(mainText.coastColor);
            materialAtmosphereGround.uniforms.displaceObj.value = new THREE.Color(mainText.displacementHeight);
            materialCloud.uniforms.cloudColor.value = new THREE.Color(mainText.cloudColor);
            material.uniforms.time.value = dTime;
            materialCloud.uniforms.time.value = dTime;
            material.uniforms.displaceObj.value = mainText.displacementHeight;
            materialCloud.uniforms.displaceObj.value = mainText.displacementHeight;
            material.uniforms.noiseSize.value = mainText.landClumping;
            materialCloud.uniforms.noiseSize.value = mainText.cloudClumping;
            materialCloud.uniforms.timeSpeed.value = mainText.cloudSpeed;
            material.uniforms.HGratio.value = mainText.HeightGroundRatio;
            material.uniforms.colorNoiseSize.value = mainText.heightColorVariation;
            material.wireframe = mainText.wireframe;
            let checkClouds = mainText.clouds ? 1.0 : 0.0;
            let checkAtmosphere = mainText.atmosphere ? 1.0 : 0.0;
            materialCloud.uniforms.isClouds.value = checkClouds;
            materialAtmosphereGround.uniforms.atmosBool.value = checkAtmosphere;
            renderer.render( scene, camera );
            prevTime = clock.getElapsedTime();
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
    this.atmosphere = true;
    this.heightColor ="rgb(96,128,56)";
    this.heightColorVariation = 0.5;
    this.cloudSpeed = 0.02;
    this.groundColor ="rgb(0,119,190)"; 
    this.cloudColor ="rgb(221,231,238)";
    this.coastColor ="rgb(194,178,128)";
    this.atmosphereColor ="rgb(20,20,80)";  
};


