import canvasSketch from 'canvas-sketch';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import vertex from './vertex.glsl';
import fragment from './fragment.glsl';

const settings = {
  animate: true,
  context: 'webgl',
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({ context });

  const camera = new THREE.OrthographicCamera();

  const controls = new OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const planeGeo = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
  const planeMat = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    vertexShader: vertex,
    fragmentShader: fragment
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  scene.add(plane);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const zoom = 1;

      camera.left = -zoom;
      camera.right = zoom;
      camera.top = zoom;
      camera.bottom = -zoom;

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