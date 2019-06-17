import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';
import { Triangle } from '../shapes/triangle';
import { Polygon } from 'shapes/polygon';

export class CanvasRender extends Render {
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  protected ctx: CanvasRenderingContext2D;
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  protected canvas: HTMLCanvasElement = null;

  constructor(name: string, protected rootElem: HTMLElement) {
    super(name);
  }

  init() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas-container');
    canvas.setAttribute('width', '1000');
    canvas.setAttribute('height', '1000');

    this.rootElem.appendChild(canvas);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas = canvas;
  }

  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  remove(obj: Shape): void {}

  colorObject(s: Shape): void {
    this.ctx.fillStyle = s.fillColor;
    this.ctx.strokeStyle = s.strokeColor;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawObjects(...objs: Shape[]): void {
    for (const shape of objs) {
      this.ctx.save();
      if (shape instanceof Circle) {
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.coordinates[0].x,
          shape.coordinates[0].y,
          shape.radius * shape.scaleX,
          shape.radius * shape.scaleY,
          shape.rotation,
          0,
          2 * Math.PI
        );
        this.ctx.closePath();
      } else if (shape instanceof Rectangle) {
        this.ctx.rect(
          shape.coordinates[0].x,
          shape.coordinates[0].y,
          shape.width * shape.scaleX,
          shape.height * shape.scaleY
        );
      } else if (shape instanceof Triangle || shape instanceof Polygon) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.coordinates[0].x, shape.coordinates[0].y);

        shape.coordinates.forEach((element, index) => {
          if (index > 0) {
            let x = 0;
            let y = 0;

            if (shape.scaleX > 1) {
              x = element.x * shape.scaleX - shape.coordinates[0].x;
            } else if (shape.scaleX === 1) {
              x = element.x;
            } else {
              x = (element.x + shape.coordinates[0].x) * shape.scaleX;
            }

            if (shape.scaleY > 1) {
              y = element.y * shape.scaleY - shape.coordinates[0].y;
            } else if (shape.scaleY === 1) {
              y = element.y;
            } else {
              y = (element.y + shape.coordinates[0].y) * shape.scaleY;
            }

            this.ctx.lineTo(x, y);
          }
        });
        this.ctx.closePath();
      }
      this.colorObject(shape);
      this.ctx.restore();
    }
  }
}
