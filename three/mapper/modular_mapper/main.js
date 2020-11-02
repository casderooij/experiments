import { debounce } from './utils';
import map from './assets/map_1.png';

import { DoubleSide, InstancedBufferAttribute, InstancedMesh, Object3D, PerspectiveCamera, PlaneBufferGeometry, Scene, ShaderMaterial, TextureLoader, WebGLRenderer } from 'three';
import BackgroundCanvas from './background-canvas';

class Sketch {
  constructor() {
    this.shouldRender = false;
    this.backgroundCanvas = new BackgroundCanvas({ size: 80, aspect: 1.4 })
    this.startTime = 0;
    this.tick = 0;

    this.setup();
    this.resize();

    this.addMesh();

    this.render = this.render.bind(this);

    this.render();
    this.shouldRender = true;

  }
  
  setup() {
    // Add window events
    window.addEventListener('resize', debounce(() => this.resize(), 250));

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor('#000', 1);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 1.4;
    this.camera.lookAt(0, 0, 0);

    this.scene = new Scene();
  }

  addMesh() {
    this.gridSize = 1;
    this.cellSize = this.gridSize / 60;

    this.planeGeo = new PlaneBufferGeometry(this.cellSize, this.cellSize);
    this.planeMat = new ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      vertexShader: `
        attribute float aInstanceScale;

        varying vec2 vUv;
        varying float vScale;

        void main() {
          vUv = uv;
          vScale = aInstanceScale;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vScale;
        uniform sampler2D t1;

        void main() {
          float size = 32.;
          vec2 newUV = vUv;
          newUV.x = vUv.x / size + floor(vScale * size) / size;
          vec4 texture = texture2D(t1, newUV);
          gl_FragColor = texture;
        }
      `,
      uniforms: {
        t1: {
          type: 't',
          value: new TextureLoader().load(map),
        }
      },
      side: DoubleSide,
    });
    this.plane = new InstancedMesh(this.planeGeo, this.planeMat, 80 * (80 * 1.4));

    const dummy = new Object3D();
    let count = 0;
    let scales = new Float32Array(80 * (80 * 1.4));
    for (let i = 0; i < (80 * 1.4); i++) {
      for (let j = 0; j < 80; j++) {
        dummy.position.set(j * this.cellSize - 0.5, -i * this.cellSize + 0.5);
        dummy.updateMatrix();
        scales.set([Math.random()], count);
        this.plane.setMatrixAt(count++, dummy.matrix);
      }
    }

    this.plane.geometry.setAttribute('aInstanceScale', new InstancedBufferAttribute(scales, 1));
    this.plane.instanceMatrix.needsUpdate = true;

    this.scene.add(this.plane);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Resize background canvas
    this.backgroundCanvas.resize(this.width, this.height);
  }

  terminate() {
    // Remove window events
    window.removeEventListener('resize');
  }

  render() {
    if (!this.shouldRender) {
      requestAnimationFrame(this.render);
      return false;
    }

    const time = this.startTime + performance.now() / 1000;
    this.tick++;

    this.backgroundCanvas.update({ time, tick: this.tick });

    const scales = new Float32Array(80 * (80 * 1.4));
    const imageData = this.backgroundCanvas.ctx.getImageData(0, 0, 80, 80 * 1.4);

    for (let i = 0; i < imageData.data.length; i += 4) {
      scales.set([imageData.data[i] / 255], i / 4);
    }
    this.plane.geometry.attributes.aInstanceScale.array = scales;
    this.plane.geometry.attributes.aInstanceScale.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render);
    return true;
  }
}

new Sketch();