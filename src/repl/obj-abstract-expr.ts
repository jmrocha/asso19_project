import { AbstractExpr } from './abstract-expr';
import { Render } from 'render/render';
import { SimpleDrawDocument } from 'document';
import { RectObjAbstractExpr } from './rect-obj-abstract-expr';
import { CircleObjAbstractExpr } from './circle-obj-abstract-expr';
import { PolygonObjAbstractExpr } from './polygon-obj-abstract-expr';
import { TriangleObjAbstractExpr } from './triangle-obj-abstract-expr';

export class ObjAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const shape = input.split(' ')[1];

    switch (shape) {
      case 'rect':
        return new RectObjAbstractExpr(
          this.simpleDrawDocument,
          this.render
        ).evaluate(input);
      case 'circle':
        return new CircleObjAbstractExpr(
          this.simpleDrawDocument,
          this.render
        ).evaluate(input);
      case 'polygon':
        return new PolygonObjAbstractExpr(
          this.simpleDrawDocument,
          this.render
        ).evaluate(input);
      case 'triangle':
        return new TriangleObjAbstractExpr(
          this.simpleDrawDocument,
          this.render
        ).evaluate(input);
      default:
        throw new Error(`draw: ${input} not recognized`);
    }
  }
}
