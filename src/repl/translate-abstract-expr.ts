import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class TranslateAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const expr = input.split(' ').slice(1);

    const shapeId = Number(expr[0]);
    const tx = Number(expr[1]);
    const ty = Number(expr[2]);

    const shape = this.simpleDrawDocument.getShapeById(shapeId);
    this.simpleDrawDocument.translate(shape, tx, ty);
    this.simpleDrawDocument.draw();

    return '';
  }
}
