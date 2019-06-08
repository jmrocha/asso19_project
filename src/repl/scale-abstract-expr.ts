import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class ScaleAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const expr = input.split(' ').slice(1);

    const shapeId = Number(expr[0]);
    const sx = Number(expr[1]);
    const sy = Number(expr[2]);

    const shape = this.simpleDrawDocument.getShapeById(shapeId);
    this.simpleDrawDocument.scale(shape, sx, sy);
    this.simpleDrawDocument.draw();

    return '';
  }
}
