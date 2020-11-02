import canvasSketch from 'canvas-sketch';
import load from 'load-asset';
import baboon from './assets/baboon.jpg';

import Two from 'two.js';

const settings = {
  dimensions: [2048, 2048],
  animate: true
};

const sketch = async ({ canvas }) => {
  const two = new Two({ domElement: canvas });

  const image = await load(baboon);

  const imageWidth = image.width;
  const imageHeight = image.height;

  const amount = 25;

  const stripHeight = Math.ceil(imageHeight / amount);

  for (let i = 0; i < amount; i++) {
    let pct = i / (amount - 1);
    let y = imageHeight * (pct - 0.5);

    let sprite = new Two.Rectangle(0, y, imageWidth, stripHeight);

    sprite.fill = new Two.Texture(image);
    sprite.fill.repeat = 'repeat-x';
    sprite.fill.offset.y = imageHeight * ((1 - pct) - 0.5);
    sprite.stroke = sprite.fill;
    two.add(sprite);
  }

  return {
    resize({ pixelRatio, width, height }) {
      two.width = width;
      two.height = height;
      two.ratio = pixelRatio;

      two.renderer.width = two.width;
      two.renderer.height = two.height;

      two.scene.translation.set(two.width / 2, two.height / 2);

      two.scene.scale = two.width / imageWidth;
    },

    render({ time }) {
      const speed = (1 + Math.sin(time * 5)) / 2;

      for (let i = 0; i < amount; i++) {
        const sprite = two.scene.children[i];
        const pct = i / amount;
        sprite.fill.offset.x += speed * Math.sin(pct * Math.PI * 3);
      }

      two.render();
    }
  }
}

canvasSketch(sketch, settings);