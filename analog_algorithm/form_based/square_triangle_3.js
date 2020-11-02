import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [1024, 1024],
};

const sketch = (props) => {
  // const tileCount = 8;
  const tileCount = 48;
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

          // return {
          //   a: { x: i * width, y: j * height + (j * stepSize) },
          //   b: { x: i * width + width, y: j * height },
          //   c: { x: i * width + width, y: j * height + height - (i * stepSize) },
          //   d: { x: i * width, y: j * height + height }
          // }

          return {
            a: { x: i * width + ((j - 1) * (stepSize * 2)), y: j * height },
            b: { x: i * width + width, y: j * height - ((stepSize * 4) * j) },
            c: { x: i * width + width, y: j * height + height - ((j + 1) * stepSize) },
            d: { x: i * width + width - ((j - 4) * (stepSize * 4)), y: j * height + height },
            e: { x: i * width + ((stepSize * 5) * i), y: j * height + height },
            f: { x: i * width - ((stepSize * 6) * j), y: j * height + (i * (stepSize * 4)) }
          }
        });
    });

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    tiles.map(row => {
      row.map(rect => {
        context.beginPath();
        context.moveTo(rect.a.x, rect.a.y);
        context.lineTo(rect.b.x, rect.b.y);
        context.lineTo(rect.c.x, rect.c.y);
        context.lineTo(rect.d.x, rect.d.y);
        context.lineTo(rect.e.x, rect.e.y);
        context.lineTo(rect.f.x, rect.f.y);
        context.closePath();
        context.fill();
      });
    });
  };
};

canvasSketch(sketch, settings);