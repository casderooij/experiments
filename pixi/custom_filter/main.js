import * as PIXI from 'pixi.js';
import t from './bg_scene_rotate.jpg';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const geometry = new PIXI.Geometry();
geometry.addAttribute(
  'aVertexPosition',
  [
    -100, -100,
    100, -100,
    100, 100
  ],
  2
);
geometry.addAttribute(
  'aColor',
  [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ],
  3
);
geometry.addAttribute(
  'aUvs',
  [
    0, 0,
    1, 0,
    1, 1
  ],
  2
);

const vertexSrc = `
  precision mediump float;

  attribute vec2 aVertexPosition;
  attribute vec3 aColor;
  attribute vec2 aUvs;

  uniform mat3 translationMatrix;
  uniform mat3 projectionMatrix;

  varying vec2 vUvs;
  varying vec3 vColor;

  void main() {
    vUvs = aUvs;
    vColor = aColor;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0., 1.);
  }
`;

const fragmentSrc = `
  precision mediump float;

  varying vec3 vColor;
  varying vec2 vUvs;

  uniform sampler2D uSampler2;

  void main() {
    gl_FragColor = texture2D(uSampler2, vUvs) * vec4(vColor, 1.);
  }
`;

const uniforms = { uSampler2: PIXI.Texture.from(t) };

const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

const triangle = new PIXI.Mesh(geometry, shader);

triangle.position.set(400, 300);
triangle.scale.set(2);

app.stage.addChild(triangle);

app.ticker.add(delta => {
  triangle.rotation += 0.01;
})