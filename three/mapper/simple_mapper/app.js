import canvasSketch from 'canvas-sketch';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import vertex from './vertex.glsl';
import fragment from './fragment.glsl';

import mapTexture from './map_3.jpg';

const settings = {
  animate: true,
  context: 'webgl',

};

const size = 80;
let plane;

const video = document.getElementById('video');
video.style.display = 'none';
const videoCanvas = document.createElement('canvas');
videoCanvas.width = size;
videoCanvas.height = size;
const ctx = videoCanvas.getContext('2d');

videoCanvas.style.display = 'none';
document.body.appendChild(videoCanvas);

video.addEventListener('play', function () {
  
  timerCallback();
}, false);

const timerCallback = () => {
  if (video.paused || video.ended) {
    return;
  }
  computeFrame();
  setTimeout(function() {
      timerCallback();
  }, 0);
}

const computeFrame = (w, h) => {
  let scales = new Float32Array(size ** 2);
  ctx.drawImage(video, 0, 0, size, size);
  let imageData = ctx.getImageData(0, 0, size, size);

  for (let i = 0; i < imageData.data.length; i+=4) {
    scales.set([imageData.data[i]/255], i/4);
  }

  plane.geometry.attributes.instanceScale.array = scales;
  plane.geometry.attributes.instanceScale.needsUpdate = true;
}

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({ context });
  renderer.setClearColor('#F5F1FF', 1);

  const camera = new THREE.OrthographicCamera();

  const controls = new OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const gridSize = 1;
  const cellSize = gridSize / size;

  const planeGeo = new THREE.PlaneBufferGeometry(cellSize, cellSize);
  const planeMat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      t1: {
        type: 't', value: new THREE.TextureLoader().load(mapTexture)
      }
    }
  });
  plane = new THREE.InstancedMesh(planeGeo, planeMat, size ** 2);

  const dummy = new THREE.Object3D();
  let count = 0;
  let scales = new Float32Array(size ** 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      dummy.position.set(j * cellSize - 0.5, -i * cellSize + 0.5);
      dummy.updateMatrix();
      scales.set([Math.random()], count);
      plane.setMatrixAt(count++, dummy.matrix);

    }
  }
  plane.geometry.setAttribute('instanceScale', new THREE.InstancedBufferAttribute(scales, 1));
  plane.instanceMatrix.needsUpdate = true;

  scene.add(plane);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const frustumSize = 1.4;
      const aspect = 1;

      camera.left = frustumSize * aspect / -2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;

      camera.near = 0;
      camera.far = 1;

      camera.updateProjectionMatrix();
    },

    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },

    unload() {
      renderer.dispose();
    }
  }
}

canvasSketch(sketch, settings);