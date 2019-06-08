import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';
import { Coordinate } from '../utilities/coordinate';

export class TriangleObjAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const exprs = input
      .split('triangle')[1]
      .split(' ')
      .splice(1);

    const points = exprs.map(coordinates => {
      let x, y;

      x = coordinates.split(',')[0];
      y = coordinates.split(',')[1];

      return new Coordinate(Number(x), Number(y));
    });

    this.simpleDrawDocument.createTriangle(points[0], points[1], points[2]);

    return '';
  }
}
