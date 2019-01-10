

varying vec3 pos;
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

uniform float time;
uniform float displaceObj;
uniform float noiseSize;
uniform float HGratio;
uniform vec3 lightPos; 
uniform vec3 cameraPos; 


void main() 
{
	float offset = 0.0;
	//get right coordinate system for blinn phong
	vec3 extraPos = mat3(modelViewMatrix) * position;
	lightDir = normalize( mat3(modelViewMatrix) * lightPos - extraPos);
	interpolatedNormal = normalize(vec3(normalMatrix * vec3(normal) ));
	eyeDir = normalize( mat3(modelViewMatrix) * cameraPos - extraPos);

	float groundHeight = 0.0;
	float height = fractalSimplexNoise(position, noiseSize, offset);
	height = 2.0 * abs(mod(height, 1.0)-0.5); //saw function
	float heightStep = smoothstep(HGratio - 0.2, HGratio + 0.2, height); //smoothstep for antialiasing
	//linear interpolation btw displaceObj and groundheight, with interpolation value heightStep,
	//displaceobj can be changed in the GUI to give the user a change to change the displacement height
    float displacement = mix(displaceObj, groundHeight, heightStep); 

    vec3 newPos = position + 0.05 * normal*displacement; //displace height depending on displacement variable
    pos = position; //send information to fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}