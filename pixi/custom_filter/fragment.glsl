varying vec2 vTextureCoord;

uniform vec4 filterArea;
uniform float pixelSize;
uniform sampler2D uSampler;

vec2 mapCoord(vec2 coord) {
  coord *= filterArea.xy;
  coord += filterArea.zw;

  return coord;
}

vec2 unmapCoord(vec2 coord) {
  coord -= filterArea.zw;
  coord /= filterArea.xy;

  return coord;
}

vec2 pixelate(vec2 coord, vec2 size) {
  return floor(coord / size) * size;
}

vec2 getMod(vec2 coord, vec2 size) {
  return mod(coord, size) / size;
}

float character(float n, vec2 p) {
  p = floor(p * vec2(4., -4.) + 2.5);

  if (clamp(p.x, 0., 4.) == p.x) {
    if (clamp(p.y, 0., 4.) == p.y) {
      if (int(mod(n / exp2(p.x + 5. * p.y), 2.)) == 1.) return 1.;
    }
  }
  return 0.;
}

void main() {
  vec2 coord = mapCoord(vTextureCoord);

  vec2 pixCoord = pixelate(coord, vec2(pixelSize));
  pixCoord = unmapCoord(pixCoord);

  vec4 color = texture2D(uSampler, pixCoord);

  float gray = (color.r + color.g + color.b) / 3.;

  float n = 65536.;               // .
  if (gray > 0.2) n = 65600.;     // :
  if (gray > 0.3) n = 332772.0;   // *
  if (gray > 0.4) n = 15255086.0; // o
  if (gray > 0.5) n = 23385164.0; // &
  if (gray > 0.6) n = 15252014.0; // 8
  if (gray > 0.7) n = 13199452.0; // @
  if (gray > 0.8) n = 11512810.0; // #

  vec2 modd = getMod(coord, vec2(pixelSize));

  gl_FragColor = color * character(n, vec2(-1.) + modd * 2.);
}