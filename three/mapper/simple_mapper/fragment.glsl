varying vec2 vUv;
uniform sampler2D t1;
varying float vScale;

void main() {
  float size = 32.;
  vec2 newUV = vUv;
  newUV.x = vUv.x / size + floor(vScale * size) / size;
  vec4 texture = texture2D(t1, newUV);
  gl_FragColor = texture;
}