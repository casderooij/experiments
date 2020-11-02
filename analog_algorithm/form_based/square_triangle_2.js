import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [2048, 2048],
};

const sketch = (props) => {
  const tileCount = 38;
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

          const stepSize = width / tileCount;

          return {
            a: {x: i * width + (j * stepSize), y: j * height},
            b: {x: i * width, y: j * height + height},
            c: { x: i * width + width, y: j * height + height - (i * stepSize) },
          }
        });
    });

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';

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