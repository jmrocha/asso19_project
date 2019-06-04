import { AbstractExpr } from './abstract-expr';
import { TermAbstractExpr } from './term-abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render';

export class ExprAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    let res = '';
    if (input === '') return res;
    input = input.toLowerCase();

    if (input.indexOf('and') !== -1) {
      const exprs = input.split('and');
      const term = exprs[0];
      const expr = exprs[1];
      new TermAbstractExpr(this.simpleDrawDocument, this.render).evaluate(term);
      this.evaluate(expr);
    } else {
      res = new TermAbstractExpr(this.simpleDrawDocument, this.render).evaluate(
        input
      );
    }

    return res;
  }
}
