import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Rectangle } from '../shapes/rectangle';
import { Circle } from '../shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';

export class SVGRender implements Render {
  private canvas: SVGElement;
  constructor(private rootElem: HTMLElement) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'canvas');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    this.rootElem.appendChild(svg);
    this.canvas = svg;
  }

  draw(...objs: Shape[]): void {
    for (const shape of objs) {
      if (shape instanceof Rectangle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        e.setAttribute('style', 'stroke: black; fill: white');
        e.setAttribute('x', shape.coordinates[0].x.toString());
        e.setAttribute('y', shape.coordinates[0].y.toString());
        e.setAttribute('width', shape.width.toString());
        e.setAttribute('height', shape.height.toString());
        this.canvas.appendChild(e);
      }
      else if (shape instanceof Circle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        e.setAttribute('cx', shape.coordinates[0].x.toString());
        e.setAttribute('cy', shape.coordinates[0].y.toString());
        e.setAttribute('r', shape.radius.toString());
        e.setAttribute('stroke', 'black');
        e.setAttribute('fill', 'white');
        this.canvas.appendChild(e);
      }
      else if (shape instanceof Triangle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'polygon'
        );

        let s = '';
        shape.coordinates.forEach((element) => {
          s += element.x + ',' + element.y + ' ';
        });

        e.setAttribute('points', s);
        e.setAttribute('style', 'stroke: black; fill: white');
        this.canvas.appendChild(e);
      }
      else if (shape instanceof Polygon) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'polygon'
        );

        let s = '';
        shape.coordinates.forEach((element) => {
          s += element.x + ',' + element.y + ' ';
        });

        e.setAttribute('points', s);
        e.setAttribute('style', 'stroke: black; fill: white');
        this.canvas.appendChild(e);
      }
    }
  }
}
