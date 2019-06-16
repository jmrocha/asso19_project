import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Rectangle } from '../shapes/rectangle';
import { Circle } from '../shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';

export class SVGRender extends Render {
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  private canvas: SVGElement = null;
  private shapes: Map<number, Shape> = new Map<number, Shape>();

  constructor(name: string, private rootElem: HTMLElement) {
    super(name);
  }

  remove(obj: Shape): void {
    const e = document.getElementById(`${obj.getId()}`);
    if (e) {
      e.remove();
      this.shapes.delete(obj.getId());
    }
  }

  init() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'canvas');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('style', 'white');
    this.rootElem.appendChild(svg);
    this.canvas = svg;
  }

  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  drawObjects(...objs: Shape[]): void {
    for (const shape of objs) {
      if (shape instanceof Rectangle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        e.setAttribute('id', `${shape.getId()}`);
        e.setAttribute(
          'style',
          'stroke: ' + shape.strokeColor + '; fill: ' + shape.fillColor
        );
        e.setAttribute('x', shape.coordinates[0].x.toString());
        e.setAttribute('y', shape.coordinates[0].y.toString());
        e.setAttribute('width', (shape.width * shape.scaleX).toString());
        e.setAttribute('height', (shape.height * shape.scaleY).toString());

        //transformation (REPEATED CODE)
        let transformations = '';
        if (shape.rotation !== 0) {
          transformations +=
            'rotate(' +
            shape.rotation +
            ',' +
            shape.coordinates[0].x +
            ',' +
            shape.coordinates[0].y +
            ') ';
        }
        e.setAttribute('transform', transformations);
        //end transformations

        this.canvas.appendChild(e);
      } else if (shape instanceof Circle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'ellipse'
        );
        e.setAttribute('id', `${shape.getId()}`);
        e.setAttribute('cx', shape.coordinates[0].x.toString());
        e.setAttribute('cy', shape.coordinates[0].y.toString());
        e.setAttribute('rx', (shape.radius * shape.scaleX).toString());
        e.setAttribute('ry', (shape.radius * shape.scaleY).toString());
        e.setAttribute('stroke', shape.strokeColor);
        e.setAttribute('fill', shape.fillColor);

        //transformation (REPEATED CODE)
        let transformations = '';
        if (shape.rotation !== 0) {
          transformations +=
            'rotate(' +
            shape.rotation +
            ',' +
            shape.coordinates[0].x +
            ',' +
            shape.coordinates[0].y +
            ') ';
        }
        e.setAttribute('transform', transformations);
        //end transformations

        this.canvas.appendChild(e);
      } else if (shape instanceof Triangle || shape instanceof Polygon) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'polygon'
        );

        let s = '';
        shape.coordinates.forEach((element, index) => {
          if (index === 0) {
            s += element.x + ',' + element.y + ' ';
          } else {
            if (shape.scaleX > 1) {
              s += element.x * shape.scaleX - shape.coordinates[0].x + ',';
            } else if (shape.scaleX === 1) {
              s += element.x + ',';
            } else {
              s += (element.x + shape.coordinates[0].x) * shape.scaleX + ',';
            }

            if (shape.scaleY > 1) {
              s += element.y * shape.scaleY - shape.coordinates[0].y + ' ';
            } else if (shape.scaleY === 1) {
              s += element.y + ' ';
            } else {
              s += (element.y + shape.coordinates[0].y) * shape.scaleY + ' ';
            }
          }
        });

        e.setAttribute('id', `${shape.getId()}`);
        e.setAttribute('points', s);
        e.setAttribute(
          'style',
          'stroke: ' + shape.strokeColor + '; fill: ' + shape.fillColor
        );

        //transformation (REPEATED CODE)
        let transformations = '';
        if (shape.rotation !== 0) {
          transformations +=
            'rotate(' +
            shape.rotation +
            ',' +
            shape.coordinates[0].x +
            ',' +
            shape.coordinates[0].y +
            ') ';
        }
        e.setAttribute('transform', transformations);
        //end transformations

        this.canvas.appendChild(e);
      }
    }
  }
}
