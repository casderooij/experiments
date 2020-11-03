import {gsap} from 'gsap';

import idoImg from './assets/ido.jpg';
import meImg from './assets/me.jpg';
import neoImg from './assets/neo.jpg';

import { loadImage } from './utils';

class Particle {
  constructor(size) {
    this.size = size;
    this.tickOffset = Math.floor(Math.random() * 200);
    this.change = Math.floor(Math.random() * 50);
    
    this.radius = 0.4;
    this.alpha = {
      value: 0
    };
    
    this.direction = {
      value: Math.random() * (Math.PI * 2)
    };
    
    this.reset();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha.value})`;
    ctx.fill();
  }

  reset() {
    this.pos = {
      x: Math.floor(Math.random() * ((this.size - 10) - 10 + 1) + 10),
      y: Math.floor(Math.random() * ((this.size - 10) - 10 + 1) + 10)
    };
    this.velocity = {
      x: Math.random() * 0.4,
      y: Math.random() * 0.4
    };
    this.alpha.value = 0;
    this.lifetime = Math.floor(Math.random() * 8) + 2;
    this.step = 0;
  }

  update(tick) {
    this.pos.x += Math.cos(this.direction.value) * this.velocity.x;
    this.pos.y += Math.sin(this.direction.value) * this.velocity.y;

    if (tick % this.change === 0) {
      if (this.step === 1) {
        gsap.to(this.alpha, {
          duration: 2,
          ease: 'ease.in',
          value: 0.2,
        });
      }
      if(this.lifetime === this.step) {
        gsap.to(this.alpha, {
          duration: 3,
          ease: 'ease.out',
          value: 0,
          onComplete: () => this.reset()
        });
      }

      const newDir = (Math.random() - 0.5) * (Math.PI * 4);
      gsap.to(this.direction, {
        duration: 2,
        ease: 'ease.in.out',
        value: newDir
      });
      this.step++;
    }
  }
}

class BackgroundCanvas {
  constructor(opts = {}) {
    this.size = opts.size;
    this.createCanvas();

    this.imgArray = [];
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
    
    const particlesCount = 14;
    this.particles = Array(particlesCount).fill().map(_ => new Particle(this.size));

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
    this.canvas.height = this.size;
  }

  update(tick) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // this.imgArray.map((img, i) => {
    //   this.ctx.save();
    //   this.ctx.translate(Math.cos(tick * 0.01) * 2, Math.sin(tick * 0.01) + i * img.height * 0.05);
    //   this.ctx.rotate(0.2);
    //   this.ctx.drawImage(img, 10, 0, img.width * 0.05, img.height * 0.05);
    //   this.ctx.restore();
    // });

    this.particles.map(p => {
      p.draw(this.ctx);
      p.update(tick);
    });
  }
}

export default BackgroundCanvas;