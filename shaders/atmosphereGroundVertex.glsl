// Atmospheric scattering ground vertex shader
// Author: Sean O'Neil
// Copyright (c) 2004 Sean O'Neil
// found at http://jsfiddle.net/VsWb9/770/
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

uniform vec3 lightPos; 
uniform vec3 cameraPos; 
//atmosphere variables
uniform vec3 inWavelength; 
uniform float cameraHeight;	// The camera's current height
uniform float cameraHeight2;	// fCameraHeight^2
uniform float outerRadius;		// The outer (atmosphere) radius
uniform float outerRadius2;	// fOuterRadius^2
uniform float innerRadius;		// The inner (planetary) radius
uniform float innerRadius2; // fInnerRadius^2
uniform float krESun;			// Kr * ESun
uniform float kmESun;			// Km * ESun
uniform float kr4PI;			// Kr * 4 * PI
uniform float km4PI;			// Km * 4 * PI
uniform float scale;			// 1 / (fOuterRadius - fInnerRadius)
uniform float scaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
uniform float scaleOverScaleDepth; // fScale / fScaleDepth

const int samples = 4; 
const float invSamples = 0.25; 

varying vec3 color; 
varying vec3 secondaryColor;	
varying vec3 v3Direction; 

uniform float displaceObj;

float scaleF(float fCos)	
{	
	float x = 1.0 - fCos;	
	return scaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));	
} 

void main() 
{
    vec3 extraPos = mat3(modelViewMatrix) * position;
	lightDir = normalize( mat3(modelViewMatrix) * lightPos - extraPos);
	interpolatedNormal = normalize(vec3(normalMatrix * vec3(normal) ));
	eyeDir = normalize( mat3(modelViewMatrix) * cameraPos - extraPos);

    vec3 v3Ray = position - cameraPos;
	float fFar = length(v3Ray);
	v3Ray /= fFar;

	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
	float B = 2.0 * dot(cameraPos, v3Ray);
	float C = cameraHeight2 - outerRadius2;
	float fDet = max(0.0, B*B - 4.0 * C);
    float fNear = 0.5 * (-B - sqrt(fDet));

    // Calculate the ray's starting position, then calculate its scattering offset	
	vec3 v3Start = v3Ray * fNear;	
	fFar -= fNear;	
	float fDepth = exp((innerRadius - outerRadius) / scaleDepth);	
	vec3 newNormal = normalize(position);	
	float fCameraAngle = dot(-v3Ray, newNormal);	
	float fLightAngle = dot(lightDir, newNormal);	
	float fCameraScale = scaleF(fCameraAngle);	
	float fLightScale = scaleF(fLightAngle);	
	float fCameraOffset = fDepth*fCameraScale;	
    float fTemp = (fLightScale + fCameraScale);

    // Initialize the scattering loop variables	
	float fSampleLength = fFar * invSamples;	
	float fScaledLength = fSampleLength * scale;	
	vec3 v3SampleRay = v3Ray * fSampleLength;	
	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;	
	
	// Now loop through the sample rays	
	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);	
    vec3 v3Attenuate; 

    for(int i=0; i<samples; i++)	
	{	
		float fHeight = length(v3SamplePoint);	
		float fDepth = exp(scaleOverScaleDepth * (innerRadius - fHeight));	
		float fScatter = fDepth*fTemp - fCameraOffset;	
		v3Attenuate = exp(-fScatter * (inWavelength * kr4PI + km4PI));	
		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);	
		v3SamplePoint += v3SampleRay;	
    } 

	color = v3FrontColor * (inWavelength * krESun + kmESun);	
	// Calculate the attenuation factor for the ground	
	secondaryColor = v3Attenuate;	
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}