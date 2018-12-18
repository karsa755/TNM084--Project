

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

float fractalSimplexNoise(vec3 pos, float noiseSize)
{
	return (snoise(pos / noiseSize) + 0.5*snoise(pos*2.0 / noiseSize) + 0.25*snoise(pos*4.0/ noiseSize) + 0.125*snoise(pos*8.0/ noiseSize));
}

void main() 
{

	vec3 extraPos = mat3(modelViewMatrix) * position;
	lightDir = normalize( mat3(modelViewMatrix) * lightPos - extraPos);
	interpolatedNormal = normalize(vec3(normalMatrix * vec3(normal) ));
	eyeDir = normalize( mat3(modelViewMatrix) * cameraPos - extraPos);

	float groundHeight = 0.0;
	float height = fractalSimplexNoise(position, noiseSize);
	height = 2.0 * abs(mod(height, 1.0)-0.5);
	float heightStep = smoothstep(HGratio - 0.2, HGratio + 0.2, height);
    float displacement = mix(displaceObj, groundHeight, heightStep);

    vec3 newPos = position + 0.05 * normal*displacement;
    pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}