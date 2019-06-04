import { AbstractExpr } from './abstract-expr';
import { DrawAbstractExpr } from './draw-abstract-expr';
import { RemoveAbstractExpr } from './remove-abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class TermAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const res = '';
    if (input.indexOf('draw') !== -1) {
      const exprs = input.split('draw');
      const drawExpr = exprs[1];

      new DrawAbstractExpr(this.simpleDrawDocument, this.render).evaluate(
        drawExpr
      );
    } else if (input.indexOf('remove') !== -1) {
      const expr = input.split('remove')[1];
      new RemoveAbstractExpr(this.simpleDrawDocument, this.render).evaluate(
        expr
      );
    } else {
      const command = input.split(' ')[0];
      throw new Error(`${command}: command not found`);
    }

    return res;
  }
}
