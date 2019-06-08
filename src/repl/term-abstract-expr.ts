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
    const command = input.split(' ')[0];

    if (command.match('draw')) {
      const exprs = input.split('draw');
      const drawExpr = exprs[1];

      return new DrawAbstractExpr(
        this.simpleDrawDocument,
        this.render
      ).evaluate(drawExpr);
    } else if (command.match('remove')) {
      const expr = input.split('remove')[1];
      return new RemoveAbstractExpr(
        this.simpleDrawDocument,
        this.render
      ).evaluate(expr);
    } else if (command.match('undo')) {
      this.simpleDrawDocument.undo();
    } else if (command.match('redo')) {
      this.simpleDrawDocument.redo();
    } else {
      const command = input.split(' ')[0];
      throw new Error(`${command}: command not found`);
    }

    return res;
  }
}
