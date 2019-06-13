import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class RenderAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const renderName = input
      .split('render')[1]
      .trim()
      .toLowerCase();

    this.simpleDrawDocument.changeRender(renderName);

    return '';
  }
}
