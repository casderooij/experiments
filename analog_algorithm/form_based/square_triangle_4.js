import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [4096, 128],
};

const sketch = (props) => {
  const tileCount = 32;
  const tiles = Array(tileCount)
    .fill(0)
    .map((_, i) => {
      const [width] = [
        props.width / tileCount,
      ];
      const height = 64;

      const origin = { x: i * width + width, y: 1 * height + height };
      const stepSize = width / tileCount;

      return {
        a: { x: origin.x - width, y: (origin.y) - (1 + stepSize * i) },
        b: {x: (origin.x - stepSize) - (1 + i * stepSize), y: origin.y},
        c: origin,
        d: { x: origin.x, y: (origin.y) - (stepSize * i) },
      }
    });

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.lineWidth = '1';
    context.fillStyle = 'white';
    context.strokeStyle = 'red';

    tiles.map(rect => {
      context.beginPath();
      context.moveTo(rect.a.x, rect.a.y);
      context.lineTo(rect.b.x, rect.b.y);
      context.lineTo(rect.c.x, rect.c.y);
      context.lineTo(rect.d.x, rect.d.y);
      context.closePath();
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);