import { Shape } from '../shapes/shape';
import { CanvasRender } from './canvas-render';

export class CanvasInvertedRender extends CanvasRender {
  constructor(name: string, protected rootElem: HTMLElement) {
    super(name, rootElem);
  }

  init() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas-container');
    canvas.setAttribute('width', '1000');
    canvas.setAttribute('height', '1000');

    this.rootElem.appendChild(canvas);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.canvas = canvas;
  }

  calculateInvertedColor(color: string): string {
    const rgb: string[] = color.replace(/[^\d,]/g, '').split(',');

    const red = 255 - Number(rgb[0]);
    const green = 255 - Number(rgb[1]);
    const blue = 255 - Number(rgb[2]);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }

  colorObject(s: Shape): void {
    this.ctx.fillStyle = this.calculateInvertedColor(s.fillColor);
    this.ctx.strokeStyle = this.calculateInvertedColor(s.strokeColor);
    this.ctx.fill();
    this.ctx.stroke();
  }
}
