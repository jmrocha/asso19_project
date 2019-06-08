import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class RenderAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const shapeId = Number(input.split('remove').splice(1)[0]);
    try {
      const shape = this.simpleDrawDocument.getShapeById(shapeId);
      this.simpleDrawDocument.remove(shape);
    } catch (error) {
      throw new Error("Shape doesn't exist");
    }

    return '';
  }
}
