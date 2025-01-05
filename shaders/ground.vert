precision highp float;
varying vec3 vNormal;
varying vec2 vUv;

void main(void) {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
