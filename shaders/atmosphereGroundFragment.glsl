// Atmospheric scattering ground fragment shader
// Author: Sean O'Neil
// Copyright (c) 2004 Sean O'Neil
// found at http://jsfiddle.net/VsWb9/770/

//this one has been slightly changed from the original one for my needs.
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

varying vec3 color;
varying vec3 secondaryColor;
uniform vec3 atmoColor;
uniform float atmosBool;
void main()
{  
    float nightScale = 1.0;
    
    vec3 intensity = vec3(1.0, 1.0, 1.0);
	vec3 day = intensity * color;
	vec3 nightIntensity = 0.2 * vec3(1.0, 1.0, 1.0);

	vec3 night = nightScale * nightIntensity * nightIntensity * nightIntensity * (1.0 - color);
	vec3 blinnPhong = BlinnPhongShading(eyeDir, lightDir, interpolatedNormal);
	gl_FragColor = vec4( 0.7*atmoColor * (day + night + secondaryColor) + blinnPhong, atmosBool * 0.5); 

}