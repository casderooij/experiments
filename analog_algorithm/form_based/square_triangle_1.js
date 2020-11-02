import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [1024, 1024],
};

const sketch = (props) => {
  const tileCount = 24;
  const tiles = Array(tileCount)
    .fill(0)
    .map((_, i) => {
      return Array(tileCount)
        .fill(0)
        .map((_, j) => {
          const [width, height] = [
            props.width / tileCount,
            props.height / tileCount
          ];

          const origin = { x: i * width + width, y: j * height + height };
          const stepSize = width / tileCount;

          return {
            a: {x: (origin.x - stepSize) - (1 + i * stepSize), y: origin.y},
            b: origin,
            c: { x: origin.x, y: (origin.y - stepSize) - (1 + j * stepSize) },
            gridX: i * width,
            gridY: j * height,
            gridW: width,
            gridH: height,
          }
        });
    });

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.lineWidth = '1';
    context.fillStyle = 'white';
    context.strokeStyle = 'red';

    tiles.map(row => {
      row.map(rect => {
        context.beginPath();
        context.moveTo(rect.a.x, rect.a.y);
        context.lineTo(rect.b.x, rect.b.y);
        context.lineTo(rect.c.x, rect.c.y);
        context.closePath();
        context.fill();
      });
    });
  };
};

canvasSketch(sketch, settings);