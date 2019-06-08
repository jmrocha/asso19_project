import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class CircleObjAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const exprs = input.split('circle')[1].split(' ');

    let x, y, radius;

    x = Number(exprs[1]);
    y = Number(exprs[2]);
    radius = Number(exprs[3]);

    this.simpleDrawDocument.createCircle(x, y, radius);

    return '';
  }
}
