
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

float fractalSimplexNoise(vec3 pos, float noiseSize)
{
	//create simplex noise based on position and input parameter from GUI
	return (snoise(pos / noiseSize) + 0.5*snoise(pos*2.0 / noiseSize) + 0.25*snoise(pos*4.0/ noiseSize) + 0.125*snoise(pos*8.0/ noiseSize));
}

void main()
{
	
	float height = fractalSimplexNoise(pos, noiseSize); 
	float colorNoise = fractalSimplexNoise(pos, colorNoiseSize);
	float colorNoiseGround = fractalSimplexNoise(pos, colorGroundNoiseSize);
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