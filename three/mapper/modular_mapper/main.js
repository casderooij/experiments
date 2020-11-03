import { debounce } from './utils';
import map from './assets/map_1.png';

import { DoubleSide, InstancedBufferAttribute, InstancedMesh, Object3D, OrthographicCamera, PerspectiveCamera, PlaneBufferGeometry, Scene, ShaderMaterial, TextureLoader, WebGLRenderer } from 'three';
import BackgroundCanvas from './background-canvas';

class Sketch {
  constructor() {
    this.pixelGrid = 80;
    this.gridSize = 1;
    this.cellSize = this.gridSize / this.pixelGrid;

    this.shouldRender = false;
    this.backgroundCanvas = new BackgroundCanvas({ size: this.pixelGrid })
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
    // window.addEventListener('resize', debounce(() => this.resize(), 250));

    this.renderer = new WebGLRenderer();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.rendererSize = window.innerHeight;
    this.renderer.setSize(this.rendererSize, this.rendererSize);
    this.renderer.setClearColor('#f00', 1);
    this.renderElement = this.renderer.domElement;
    this.renderElement.id = 'render-canvas';
    // this.renderElement.style.marginLeft = '100px';
    this.renderElement.style.position = 'fixed';
    document.body.appendChild(this.renderElement);

    // this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera = new OrthographicCamera();
    this.camera.position.z = 1;
    this.camera.lookAt(0, 0, 0);

    this.scene = new Scene();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Resize background canvas
    this.backgroundCanvas.resize(this.width, this.height);

    const aspect = 1;
    const zoom = 0.5;

    this.camera.left = -zoom * aspect;
    this.camera.right = zoom * aspect;
    this.camera.top = zoom;
    this.camera.bottom = -zoom;

    this.camera.near = 1;
    this.camera.far = 100;

    this.camera.updateProjectionMatrix();
  }

  terminate() {
    // Remove window events
    window.removeEventListener('resize');
  }

  addMesh() {

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
    this.plane = new InstancedMesh(this.planeGeo, this.planeMat, this.pixelGrid**2);

    const dummy = new Object3D();
    let count = 0;
    let scales = new Float32Array(this.pixelGrid**2);
    let alpha = new Float32Array(this.pixelGrid**2);
    for (let y = 0; y < this.pixelGrid; y++) {
      for (let x = 0; x < this.pixelGrid; x++) {
        const offset = (this.cellSize * this.pixelGrid / 2) - (this.cellSize / 2);

        dummy.position.set(x * this.cellSize - offset, -y * this.cellSize + offset);
        dummy.updateMatrix();
        scales.set([Math.random()], count);
        this.plane.setMatrixAt(count++, dummy.matrix);

        alpha.set([], count);
      }
    }

    this.plane.geometry.setAttribute('aInstanceScale', new InstancedBufferAttribute(scales, 1));
    this.plane.instanceMatrix.needsUpdate = true;

    this.scene.add(this.plane);
  }

  render() {
    if (!this.shouldRender) {
      requestAnimationFrame(this.render);
      return false;
    }

    this.tick++;

    this.backgroundCanvas.update(this.tick);

    const scales = new Float32Array(this.pixelGrid * (this.pixelGrid * 1.4));
    const imageData = this.backgroundCanvas.ctx.getImageData(0, 0, this.pixelGrid, this.pixelGrid * 1.4);

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