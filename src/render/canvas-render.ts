import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Circle } from '../shapes/circle';
import { Rectangle } from '../shapes/rectangle';
import { Triangle } from '../shapes/triangle';
import { Polygon } from 'shapes/polygon';

export class CanvasRender implements Render {
  private ctx: CanvasRenderingContext2D;

  constructor(private rootElem: HTMLElement) {
    const canvas = document.createElement('canvas');

    canvas.setAttribute('id', 'canvas-container');
    canvas.setAttribute('width', '1000');
    canvas.setAttribute('height', '1000');

    rootElem.appendChild(canvas);
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  draw(...objs: Shape[]): void {
    for (const shape of objs) {
      console.log(shape);
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
      } 
      else if (shape instanceof Rectangle) {
        this.ctx.strokeRect(shape.coordinates[0].x, shape.coordinates[0].y, shape.width, shape.height);
      } 
      else if (shape instanceof Triangle) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.coordinates[0].x, shape.coordinates[0].y);
        shape.coordinates.forEach((element, index) => {
          if(index > 0) {
            this.ctx.lineTo(element.x, element.y);
          }
        });
        this.ctx.closePath();
        this.ctx.stroke();
      }
      else if (shape instanceof Polygon) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.coordinates[0].x, shape.coordinates[0].y);
        shape.coordinates.forEach((element, index) => {
          if(index > 0) {
            this.ctx.lineTo(element.x, element.y);
          }
        });
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }
  }
}
