

varying vec3 pos;
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

uniform float displaceObj;
uniform vec3 lightPos; 
uniform vec3 cameraPos; //this needs to be updated

void main() 
{
	//get right coordinate system for blinn phong
	vec3 extraPos = mat3(modelViewMatrix) * position;
	lightDir = normalize( mat3(modelViewMatrix) * lightPos - extraPos);
	interpolatedNormal = normalize(vec3(normalMatrix * vec3(normal) ));
	eyeDir = normalize( mat3(modelViewMatrix) * cameraPos - extraPos);

    pos = position; //send info to fragment
    vec3 newPos = position + 0.05 * normal*displaceObj; //clouds needs to be displaced when the height is displaced
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}