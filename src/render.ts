import { Shape, Circle, Rectangle } from './shape';

export interface Render {
  draw(...objs: Shape[]): void;
}

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
        e.setAttribute('x', shape.x.toString());
        e.setAttribute('y', shape.y.toString());
        e.setAttribute('width', shape.width.toString());
        e.setAttribute('height', shape.height.toString());
        this.canvas.appendChild(e);
      }
    }
  }
}

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
