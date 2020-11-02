varying vec2 vUv;
attribute float instanceScale;
varying float vScale;

void main() {
  vUv = uv;
  vScale = instanceScale;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}