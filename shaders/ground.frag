precision highp float;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuseNight;
varying vec3 vNormal;
varying vec2 vUv;
void main (void)
{
  vec3 diffuseTex = texture2D( tDiffuse, vUv ).xyz;
  gl_FragColor = vec4(diffuseTex, 1.0);
}
