import { AbstractExpr } from './abstract-expr';
import { Render } from 'render';
import { SimpleDrawDocument } from 'document';

export class ObjAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    let res = '';
    if (input.indexOf('rect') !== -1) {
      const exprs = input.split('rect')[1].split(' ');

      let x, y, width, height;

      x = Number(exprs[1]);
      y = Number(exprs[2]);
      width = Number(exprs[3]);
      height = Number(exprs[4]);

      this.simpleDrawDocument.createRectangle(x, y, width, height);
    }

    return res;
  }
}
