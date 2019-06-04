import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';

export class CanvasRender implements Render {
  ctx: CanvasRenderingContext2D;

  constructor() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  draw(...objs: Shape[]): void {
    for (const shape of objs) {
      if (shape instanceof Circle) {
        this.ctx.ellipse(
          shape.x,
          shape.y,
          shape.radius,
          shape.radius,
          0,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      } else if (shape instanceof Rectangle) {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    }
  }
}
