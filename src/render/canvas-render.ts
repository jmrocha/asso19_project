import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';

export class CanvasRender implements Render {
  private ctx: CanvasRenderingContext2D;

  constructor(private rootElem: HTMLElement) {
    const canvas = document.createElement('canvas');

    canvas.setAttribute('id', 'canvas-container');
    canvas.setAttribute('width', '200px');
    canvas.setAttribute('height', '200px');

    rootElem.appendChild(canvas);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  draw(...objs: Shape[]): void {
    for (const shape of objs) {
      if (shape instanceof Circle) {
        this.ctx.ellipse(
          shape.coordinates[0].x,
          shape.coordinates[0].y,
          shape.radius,
          shape.radius,
          0,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      } else if (shape instanceof Rectangle) {
        this.ctx.strokeRect(shape.coordinates[0].x, shape.coordinates[0].y, shape.width, shape.height);
      }
    }
  }
}
