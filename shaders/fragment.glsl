
uniform vec3 heightColor;
uniform vec3 groundColor;
uniform vec3 coastColor;
uniform vec3 cameraPos;

varying vec3 pos;
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

uniform float time;
uniform float noiseSize;
uniform float HGratio;
uniform float colorNoiseSize;
uniform float colorGroundNoiseSize;



void main()
{
	float offset = 1.0;	
	float height = fractalSimplexNoise(pos, noiseSize, offset); 
	float colorNoise = fractalSimplexNoise(pos, colorNoiseSize, offset);
	float colorNoiseGround = fractalSimplexNoise(pos, colorGroundNoiseSize, offset);
	height = 2.0 * abs(mod(height, 1.0)-0.5); //this is the saw function
	float heightStep = smoothstep(HGratio - 0.2, HGratio + 0.2, height); //smoothstep for antialiasing

	//this is done to create a coastline
	vec3 groundGradient = mix(coastColor, groundColor, smoothstep(0.6,1.0, heightStep));

	//mix the colors of the "height" and the "ground" with some noise
	//the ground is a mix of the actual ground color and the coastline color.
	vec3 finalColor = mix(heightColor + 0.15*colorNoise, groundGradient + 0.15 * colorNoiseGround, heightStep);
	vec3 blinnPhong = BlinnPhongShading(eyeDir, lightDir, interpolatedNormal); //add blinn phong

    gl_FragColor = vec4( finalColor + blinnPhong  ,1.0);
}