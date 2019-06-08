import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class RotateAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const expr = input.split(' ').slice(1);

    const shapeId = Number(expr[0]);
    const deg = Number(expr[1]);

    const shape = this.simpleDrawDocument.getShapeById(shapeId);
    this.simpleDrawDocument.rotate(shape, deg);
    this.simpleDrawDocument.draw();

    return '';
  }
}
