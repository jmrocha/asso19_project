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
      this.ctx.save();
      if (shape instanceof Circle) {
        //transformation (REPEATED CODE)
        if (shape.rotation !== 0) {
          this.ctx.rotate(shape.rotation * Math.PI / 180); //convert degrees to radians
        }
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          this.ctx.scale(shape.scaleX, shape.scaleY);
        }
        //end transformations
        
        this.ctx.beginPath();
        this.ctx.arc(shape.coordinates[0].x, shape.coordinates[0].y, shape.radius, 0, 2 * Math.PI);
        this.ctx.closePath();

        this.ctx.fillStyle = shape.fillColor;
        this.ctx.fill();
        this.ctx.stroke();
      } 
      else if (shape instanceof Rectangle) {
        //transformation (REPEATED CODE)
        if (shape.rotation !== 0) {
          this.ctx.rotate(shape.rotation * Math.PI / 180); //convert degrees to radians
        }
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          this.ctx.scale(shape.scaleX, shape.scaleY);
        }
        //end transformations

        this.ctx.rect(shape.coordinates[0].x, shape.coordinates[0].y, shape.width, shape.height);

        this.ctx.fillStyle = shape.fillColor;
        this.ctx.fill();
        this.ctx.stroke();
      } 
      else if (shape instanceof Triangle || shape instanceof Polygon) {
        //transformation (REPEATED CODE)
        if (shape.rotation !== 0) {
          this.ctx.rotate(shape.rotation * Math.PI / 180); //convert degrees to radians
        }
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          this.ctx.scale(shape.scaleX, shape.scaleY);
        }
        //end transformations

        this.ctx.beginPath();
        this.ctx.moveTo(shape.coordinates[0].x, shape.coordinates[0].y);
        shape.coordinates.forEach((element, index) => {
          if(index > 0) {
            this.ctx.lineTo(element.x, element.y);
          }
        });
        this.ctx.closePath();

        this.ctx.fillStyle = shape.fillColor;
        this.ctx.fill();
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }
}
