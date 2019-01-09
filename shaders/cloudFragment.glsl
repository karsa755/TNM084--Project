
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
    //fractal noise for the clouds, with an offset to "move" them
    float cloudNoise = isClouds * (fractalSimplexNoise(pos, noiseSize, time * timeSpeed));
    vec3 finalColor = cloudColor * cloudNoise;
    vec3 blinnPhong = BlinnPhongShading(eyeDir, lightDir, interpolatedNormal); //also add blinn phong shading

    gl_FragColor = vec4( finalColor + blinnPhong , 0.35);
}