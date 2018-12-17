varying vec3 color;
varying vec3 secondaryColor;
uniform vec3 atmoColor;
uniform float atmosBool;
void main()
{  
    float fNightScale = 0.3;
    
    vec3 intensity = vec3(0.8, 0.8, 0.8);
	vec3 day = intensity * color;

	vec3 night = fNightScale * intensity * intensity * intensity * (1.0 - color);
	gl_FragColor = vec4( atmoColor * (day + night + secondaryColor), atmosBool * 0.5); 

}