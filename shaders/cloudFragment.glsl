
varying vec3 pos;
varying vec3 lightDir;
varying vec3 interpolatedNormal;
varying vec3 eyeDir;

uniform vec3 cloudColor;
uniform float noiseSize;
uniform float time;
uniform float timeSpeed;
uniform float isClouds;


void main()
{
    
    float cloudNoise = isClouds * (snoise( (pos + timeSpeed * time) / noiseSize) + 
    0.5*snoise( (pos*2.0 + timeSpeed * time) / noiseSize) + 
    0.25*snoise( (pos*4.0 + timeSpeed * time) / noiseSize) + 
    0.125*snoise( (pos*8.0 + timeSpeed * time) / noiseSize));
    vec3 finalColor = cloudColor * cloudNoise;
    vec3 blinnPhong = BlinnPhongShading(eyeDir, lightDir, interpolatedNormal);

    gl_FragColor = vec4( finalColor + blinnPhong , 0.35);
}