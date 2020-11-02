import idoImg from './assets/ido.jpg';
import meImg from './assets/me.jpg';
import neoImg from './assets/neo.jpg';

import { loadImage } from './utils';

class BackgroundCanvas {
  constructor(opts = {}) {
    this.createCanvas();

    this.imgArray = [];
    this.size = opts.size;
    this.aspect = opts.aspect;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.id = 'background-canvas';

    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    const loadImg = paths => Promise.all(paths.map(loadImage));
    loadImg([idoImg, meImg, neoImg]).then((imgs) => {
      imgs.map(img => {

      })
      this.imgArray = imgs
    });
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.canvas.width = this.size;
    this.canvas.height = this.size * this.aspect;
  }

  update({ time, tick }) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.imgArray.map((img, i) => {
      this.ctx.save();
      this.ctx.translate(10, i * img.height * 0.05);
      this.ctx.rotate(0.2);
      this.ctx.drawImage(img, 0, 0, img.width * 0.05, img.height * 0.05);
      this.ctx.restore();
    });
  }
}

export default BackgroundCanvas;