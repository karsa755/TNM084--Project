

varying vec3 pos;
uniform float displaceObj;
void main() 
{
    pos = position;
    vec3 newPos = position + 0.05 * normal*displaceObj;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}