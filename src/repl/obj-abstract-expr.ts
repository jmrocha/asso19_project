import { AbstractExpr } from './abstract-expr';
import { Render } from 'render/render';
import { SimpleDrawDocument } from 'document';
import { RectObjAbstractExpr } from './rect-obj-abstract-expr';
import { CircleObjAbstractExpr } from './circle-obj-abstract-expr';

export class ObjAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    if (input.indexOf('rect') !== -1) {
      return new RectObjAbstractExpr(
        this.simpleDrawDocument,
        this.render
      ).evaluate(input);
    } else if (input.indexOf('circle') !== -1) {
      return new CircleObjAbstractExpr(
        this.simpleDrawDocument,
        this.render
      ).evaluate(input);
    }

    return '';
  }
}
