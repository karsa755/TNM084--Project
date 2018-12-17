
varying vec3 color;
varying vec3 secondaryColor;
varying vec3 v3Direction;

uniform vec3 lightPos;	
uniform float g;	
uniform float g2;	

void main (void)	
{	
	float fCos = dot(lightPos, v3Direction) / length(v3Direction);	
	float fRayleighPhase = 0.75 * (1.0 + fCos*fCos);	
	float fMiePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos*fCos) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);	
	//gl_FragColor.rgb = 1.0 - exp( -exposure * (fRayleighPhase * color + fMiePhase * secondaryColor) );
	//gl_FragColor.a = 1.0; 
	gl_FragColor = vec4(fRayleighPhase * color + fMiePhase * secondaryColor, 0.3);
	gl_FragColor.a = gl_FragColor.b;
} 