
varying vec3 pos;
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
   

    gl_FragColor = vec4( finalColor , 0.35);
}