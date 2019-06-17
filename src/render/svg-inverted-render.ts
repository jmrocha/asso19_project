import { Shape } from '../shapes/shape';
import { SVGRender } from './svg-render';

export class SVGInvertedRender extends SVGRender {
  constructor(name: string, protected rootElem: HTMLElement) {
    super(name, rootElem);
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

  calculateInvertedColor(color: string): string {
    const rgb: string[] = color.replace(/[^\d,]/g, '').split(',');

    const red = 255 - Number(rgb[0]);
    const green = 255 - Number(rgb[1]);
    const blue = 255 - Number(rgb[2]);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }

  colorObject(e: SVGElement, s: Shape): void {
    e.setAttribute (
      'style',
      'stroke: ' +
        this.calculateInvertedColor(s.strokeColor) +
        '; fill: ' +
        this.calculateInvertedColor(s.fillColor)
    );
  }
}
