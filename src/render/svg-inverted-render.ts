import { Shape } from '../shapes/shape';
import { Render } from './render';
import { Rectangle } from '../shapes/rectangle';
import { Circle } from '../shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';

export class SVGInvertedRender extends Render {
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
    svg.setAttribute('style', 'background-color: black');
    this.rootElem.appendChild(svg);
    this.canvas = svg;
  }

  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  calculateInvertedColor(color: string): string {
    const rgb: string[] = color.replace(/[^\d,]/g, '').split(',');

    const red = 255 - Number(rgb[0]);
    const green = 255 - Number(rgb[1]);
    const blue = 255 - Number(rgb[2]);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }

  drawObjects(...objs: Shape[]): void {
    for (const shape of objs) {
      if (shape instanceof Rectangle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        e.setAttribute('id', `${shape.getId()}`);
        e.setAttribute('style', 'stroke: ' + this.calculateInvertedColor(shape.strokeColor) + '; fill: ' + this.calculateInvertedColor(shape.fillColor));
        e.setAttribute('x', shape.coordinates[0].x.toString());
        e.setAttribute('y', shape.coordinates[0].y.toString());
        e.setAttribute('width', shape.width.toString());
        e.setAttribute('height', shape.height.toString());

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
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          transformations +=
            'scale(' + shape.scaleX + ',' + shape.scaleY + ') ';
        }
        e.setAttribute('transform', transformations);
        //end transformations

        this.canvas.appendChild(e);
      } else if (shape instanceof Circle) {
        const e = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        e.setAttribute('cx', shape.coordinates[0].x.toString());
        e.setAttribute('cy', shape.coordinates[0].y.toString());
        e.setAttribute('r', shape.radius.toString());
        e.setAttribute('stroke', this.calculateInvertedColor(shape.strokeColor));
        e.setAttribute('fill', this.calculateInvertedColor(shape.fillColor));

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
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          transformations +=
            'scale(' + shape.scaleX + ',' + shape.scaleY + ') ';
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
        shape.coordinates.forEach(element => {
          s += element.x + ',' + element.y + ' ';
        });

        e.setAttribute('points', s);
        e.setAttribute('style', 'stroke: ' + this.calculateInvertedColor(shape.strokeColor) + '; fill: ' + this.calculateInvertedColor(shape.fillColor));

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
        if (shape.scaleX !== 1 || shape.scaleY !== 1) {
          transformations +=
            'scale(' + shape.scaleX + ',' + shape.scaleY + ') ';
        }
        e.setAttribute('transform', transformations);
        //end transformations

        this.canvas.appendChild(e);
      }
    }
  }
}
