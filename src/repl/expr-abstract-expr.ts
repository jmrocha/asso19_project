import { AbstractExpr } from './abstract-expr';
import { TermAbstractExpr } from './term-abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class ExprAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    let res = '';
    if (input === '') return res;
    input = input.trim().toLowerCase();

    const exprs = input.split('and');

    if (exprs.length > 1) {
      const exprs = input.split('and');
      const term = exprs[0];
      const expr = exprs[1];
      res += new TermAbstractExpr(this.simpleDrawDocument, this.render).evaluate(term);
      res += ', ';
      res += this.evaluate(expr);
    } else {
      res = new TermAbstractExpr(this.simpleDrawDocument, this.render).evaluate(
        input
      );
    }

    return res;
  }
}