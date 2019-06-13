import { AbstractExpr } from './abstract-expr';
import { ObjAbstractExpr } from './obj-abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class DrawAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const res = new ObjAbstractExpr(
      this.simpleDrawDocument,
      this.render
    ).evaluate(input);
    this.simpleDrawDocument.draw();
    return res;
  }
}
